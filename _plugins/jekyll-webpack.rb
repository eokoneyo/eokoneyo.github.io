require "json"

class ProcessWebpackOutput
  def initialize(site)
    @site = site
  end

  def do_work
    transpilerConfig = @site.config["webpack"] || {}

    cacheDir = transpilerConfig["cache_directory"]

    return Jekyll.logger.info("Jekyll-webpack:", "Cache Directory #{cacheDir} was not found ...") unless File.exists?(cacheDir)

    # Exclude the cache directory from the jekyll watch, to prevent an infinite work loop
    @site.exclude << cacheDir

    outputPath, hasServiceWorker = (transpilerConfig["output"]).values_at("path", "service_worker")

    manifestFile = File.join("_data", "webpack-manifest.json")
    manifestFileData = JSON.parse(File.read(manifestFile))
    manifestFileData.each do |key, fileName|
      Jekyll.logger.info("Jekyll-webpack:", "Processing #{fileName} ...")

      if hasServiceWorker && fileName.match(/sw|service_worker/)
        fileDest = File.join(@site.dest, fileName)
      else
        fileDest = File.join(@site.dest, outputPath, fileName)
      end

      # use overridden method to place processed webpack files exactly where we wan them :)
      @site.static_files << Jekyll::ControlledStaticFile.new(@site, @site.source, cacheDir, fileName, fileDest)
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site, payload|
  # code to call before Jekyll renders the whole site, but before writing any files
  ProcessWebpackOutput.new(site).do_work()
end
