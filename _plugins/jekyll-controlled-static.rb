## Override Jekyll StaticFile method defined here
## https://github.com/jekyll/jekyll/blob/master/lib/jekyll/static_file.rb#L101
## so we can provide our own preferred destination
module Jekyll
  class ControlledStaticFile < Jekyll::StaticFile
    def initialize(site, base, dir, name, dest)
      super(site, base, dir, name)

      @dest = dest
    end

    def destination(destFromParent)
      @dest
    end
  end
end
