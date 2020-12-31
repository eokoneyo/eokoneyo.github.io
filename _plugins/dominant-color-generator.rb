module DominantColor
  class Generator < Jekyll::Generator
    safe true

    def generate(site)
      projectPosts = site.categories['projects']
      projectPosts.each do |doc|
        unless doc.data['dominantColor']
          random_color = RandomColor.new
          doc.data['dominantColor'] = random_color.hex
        end
      end
    end
  end

  # link: https://stackoverflow.com/a/58115927/4398075
  class RandomColor
    def initialize(params = {})
      @params = params
    end

    def get_random
      rand(255)
    end

    def get_random_color()
      default = {
        red: self.get_random, green: self.get_random, blue: self.get_random
      }
      _options = default.merge(@params)
    end

    def hex()
      color = self.get_random_color
      '#%X%X%X' % color.values
    end

    def rgb_string()
      color = self.get_random_color
      color.values.join(',')
    end
  end
end
