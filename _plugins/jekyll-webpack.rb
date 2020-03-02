require 'json'

## Override destination method from here https://github.com/jekyll/jekyll/blob/master/lib/jekyll/static_file.rb#L101
## so we can provide our own preferred destination
module Jekyll
    class TranspiledStaticFile < Jekyll::StaticFile
        def initialize(site, base, dir, name, dest)
            super(site, base, dir, name)

            @dest = dest
        end

        def destination(destFromParent)
            @dest
        end
    end
end

class ProcessWebpackOutput
    def initialize(site)
        @site = site
    end
    
    def do_work
        transpilerConfig = @site.config['webpack'] || {}

        cacheDir = transpilerConfig['cache_directory']

        return Jekyll.logger.info("Jekyll-babel:", "Cache Directory #{cacheDir} was not found ...") unless File.exists?(cacheDir)

        # Exclude the cache directory from the jekyll watch, to prevent an infinite work loop
        @site.exclude << cacheDir

        outputPath = (transpilerConfig['output']).values_at("path")

        manifestFile = File.join('_data', 'webpack-manifest.json');
        manifestFileData = JSON.parse(File.read(manifestFile))
        manifestFileData.each do |key, fileName|
          Jekyll.logger.info("Jekyll-babel:", "Processing #{fileName} ...")

          # use overridden method to add processed webpack file :)
          fileDest = File.join(@site.dest, outputPath, fileName)
          @site.static_files << Jekyll::TranspiledStaticFile.new(@site, @site.source, cacheDir, fileName, fileDest)
        end
    end
end

Jekyll::Hooks.register :site, :pre_render do |site, payload|
    # code to call before Jekyll renders the whole site, but before writing any files
    ProcessWebpackOutput.new(site).do_work()
end
