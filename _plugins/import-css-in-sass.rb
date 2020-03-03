# @link : https://www.webfoobar.com/node/80
# @description: allows sass to import css files

require 'sass/importers'

class Sass::Importers::Filesystem
  alias :css_importer :extensions
  def extensions
    css_importer.merge('css' => :scss)
  end
end
