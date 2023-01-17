require 'open3'
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
          return nil unless converter.options[:enable_shiki] and type == :block

          script = <<-JS
          // require shiki module installed in project
          const shiki = require('shiki');

          async function generateCodeBlock(code, lang, theme = 'nord') {
            const highlighter = await shiki.getHighlighter({ theme });
            return highlighter.codeToHtml(code, { lang });
          }

          void (async () => {
            const [, ...args] = process.argv;
            console.log(await generateCodeBlock.apply(null, args));
          })();
          JS

          command = ['node', '-e', script, text, lang || 'plaintext']

          Open3.popen3(*command) do |stdin, stdout, stderr, wait_thr|
            # read the output from the process
            output = stdout.read

            # handle the output
            return output
          end
        end
      end
    end

    add_syntax_highlighter(:shiki, SyntaxHighlighter::Shiki)
  end
end
