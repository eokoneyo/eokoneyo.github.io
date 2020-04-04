module DominantColor
    class Generator < Jekyll::Generator
        safe true

        def generate(site)
            projectPosts = site.categories['projects']
            projectPosts.each do |doc|
                unless doc.data['dominantColor']
                    doc.data['dominantColor'] = RandomColor.color_hex();
                end
            end
        end
    end

    # link: https://stackoverflow.com/a/58115927/4398075
    class RandomColor
      def self.get_random
        rand(255)
      end

      def self.color_hex(options = {})
        default = { red: get_random, green: get_random, blue: get_random }
        options = default.merge(options)
        '#%X%X%X' % options.values
      end
    end
end
