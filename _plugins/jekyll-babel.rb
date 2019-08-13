require 'babel/transpiler'

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

class TranspileES6
    def initialize(site)
        @site = site
        @cacheDir = '.jekyll-babel-cache'
    end
    
    def do_work
        transpilerConfig = @site.config['babel'] || {}

        entryFile = transpilerConfig['entry']

        return Jekyll.logger.info("Jekyll-babel:", "file #{entryFile} was not found ...") unless File.exists?(entryFile)

        fileName, outputPath = (transpilerConfig['output']).values_at("filename", "path")

        FileUtils.mkdir_p(@cacheDir) unless File.exists?(@cacheDir)

        # Exclude the cache directory from the jekyll watch, to prevent an infinite work loop
        @site.exclude << @cacheDir

        outputFileName = File.join(@cacheDir, fileName)

        Jekyll.logger.info("Jekyll-babel:", "Transpiling #{entryFile} ...")

        result = Babel::Transpiler.transform File.read(entryFile);

        File.open(outputFileName, "w") {|file|
            file.write result['code']
        }

        #use overridden method :)
        @site.static_files << Jekyll::TranspiledStaticFile.new(@site, @site.source, @cacheDir, fileName, File.join(@site.dest, outputPath, fileName))
    end
end

Jekyll::Hooks.register :site, :pre_render do |site, payload|
    # code to call before Jekyll renders the whole site, but before writing any files
    es6Transpiler = TranspileES6.new(site)

    es6Transpiler.do_work()
end