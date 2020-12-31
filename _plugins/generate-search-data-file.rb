require 'json'
require 'tempfile'

class GenerateSearchData
  def initialize
    Jekyll::Hooks.register :site, :post_render do |site|
      self.write_search_data(site)
    end

    Jekyll::Hooks.register :site, :post_write do
      self.unlink_tempfile
    end
  end

  def generate_json_search_data(docs)
    search_data = []

    docs.each do |doc|
      search_data.push(
        {
          title: doc.data['title'],
          url: doc.url,
          category: doc.data['category'],
          date: doc.data['date'].strftime('%B %d, %Y'),
          content: doc.data['excerpt'].to_s.gsub(%r{<\/?[^>]*>}, '')
        }
      )
    end

    JSON.pretty_generate(search_data)
  end

  def write_search_data(site)
    searchDataConfiguration = site.config['search_data'] || {}

    @f = Tempfile.new('search-data')

    @f.write(self.generate_json_search_data(site.posts.docs))

    @f.rewind

    output_path, filename =
      searchDataConfiguration.values_at('output_path', 'filename')

    file_dest = File.join(site.dest, output_path, filename)

    site.static_files <<
      Jekyll::ControlledStaticFile.new(
        site,
        '',
        File.dirname(@f.path),
        File.basename(@f.path),
        file_dest
      )
  end

  def unlink_tempfile
    @f.unlink
  end
end

GenerateSearchData.new
