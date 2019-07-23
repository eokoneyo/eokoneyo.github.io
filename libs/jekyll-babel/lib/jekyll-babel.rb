require 'babel/transpiler'

class TranspileES6
    def initialize(site)
        @site = site
        @cacheDir = '.jekyll-babel-cache'
    end
    
    def do_work
        transpilerConfig = @site.config['babel'] || {}

        entryFile = transpilerConfig['entry']

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

        # Jekyll::StaticFile.new(@site, out_dir, File.dirname(relative_path), File.basename(relative_path))
        @site.static_files << Jekyll::StaticFile.new(@site, @site.source, @cacheDir, fileName)
    end
end

Jekyll::Hooks.register :site, :pre_render do |site, payload|
    # code to call before Jekyll renders the whole site, but before writing any files

    es6Transpiler = TranspileES6.new(site)

    es6Transpiler.do_work()
end
