require 'execjs'
require 'open-uri'
require 'kramdown/options'
require 'kramdown/converter'

module Kramdown
  module Options
    define(:enable_shiki, Boolean, true, <<~EOF)
      Use shiki for syntax highlighting

      If this option is `true`, shiki is used by the HTML converter for
      syntax highlighting the content of code spans and code blocks.

      Default: true
      Used by: HTML converter
    EOF

    define(:shiki_default_lang, Symbol, nil, <<~EOF)
      Sets the default language for highlighting code blocks

      If no language is set for a code block, the default language is used
      instead. The value has to be one of the languages supported by shiki
      or nil if no default language should be used.

      Default: nil
      Used by: HTML converter
    EOF
  end

  module Converter
    module SyntaxHighlighter
      module Shiki
        def self.call(converter, text, lang, type, call_opts)
          return nil unless converter.options[:enable_shiki]

          # enforce nodejs as runtime of choice for execjs
          ExecJS.runtime = ExecJS::Runtimes::Node

          # fetch source code for shiki from unpkg
          source =
            URI.open('https://unpkg.com/shiki@0.10.1/dist/index.unpkg.iife.js')
              .read

          context = ExecJS.compile(source)

          script = <<-JS
            function (code, lang, theme) {
              var output;

              shiki
                .getHighlighter({ theme: theme })
                .then(function (highlighter) {
                    output = highlighter.codeToHtml(`${code}`, { lang: lang || "plaintext" });
                })
                .catch(function (err) { output = err.message });

              while (output === undefined) {/*do nothing till shiki is done*/}

              return output;
            }
          JS

          return context.call(script, text, lang, 'nord')
        rescue => error
          puts error
          converter.warning("There was an error using Shiki: #{$!.message}")
          nil
        end
      end
    end

    add_syntax_highlighter(:shiki, SyntaxHighlighter::Shiki)
  end
end
