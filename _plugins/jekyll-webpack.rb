# The ProcessWebpackOutput class helps us mark the processed webpack files
# as static files for jekyll build process.

class ProcessWebpackOutput
  def initialize(site)
    @site = site
  end

  def recursive_copy(
    dir_path, outputPath, processServiceWorker, sub_directory = ''
  )
    Dir.each_child(dir_path) do |fileName|
      if File.directory?(File.join(dir_path, fileName))
        self.recursive_copy(
          File.join(dir_path, fileName),
          outputPath,
          processServiceWorker,
          fileName
        )
      else
        # place serviceworker file in root because of issues with scope,
        # especially since we can't set headers in Jekyll
        if processServiceWorker && fileName.match(/(sw|service_worker).*.js/)
          fileDest = File.join(@site.dest, fileName)
        else
          fileDest = File.join(@site.dest, outputPath, sub_directory, fileName)
        end

        Jekyll.logger.debug(
          'Jekyll-webpack:',
          "Processing #{fileName} -> #{fileDest} ..."
        )

        # use overridden method to place processed webpack files exactly where we want them :)
        @site.static_files <<
          Jekyll::ControlledStaticFile.new(
            @site,
            @site.source,
            dir_path,
            fileName,
            fileDest
          )
      end
    end
  end

  def do_work
    transpilerConfig = @site.config['webpack'] || {}

    cacheDir = transpilerConfig['cache_directory']

    unless File.exists?(cacheDir)
      return(
        Jekyll.logger.info(
          'Jekyll-webpack:',
          "Cache Directory #{cacheDir} was not found ..."
        )
      )
    end

    # Exclude the cache directory from the jekyll watch, to prevent an infinite work loop
    @site.exclude << cacheDir

    outputPath, hasServiceWorker =
      (transpilerConfig['output']).values_at('path', 'service_worker')

    self.recursive_copy(cacheDir, outputPath, hasServiceWorker)
  end
end

Jekyll::Hooks.register :site, :pre_render do |site, payload|
  # code to call before Jekyll renders the whole site, but before writing any files
  ProcessWebpackOutput.new(site).do_work
end
