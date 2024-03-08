require "open3"
require "kramdown/options"
require "kramdown/converter"

module Kramdown
  module Options
    define(:enable_shiki, Boolean, true, <<~EOF)
      Use shiki for syntax highlighting

      If this option is `true`, shiki is used by the HTML converter for
      syntax highlighting the content of code spans and code blocks.

      Default: true
      Used by: HTML converter
    EOF

    define(:shiki_default_lang, String, "plaintext", <<~EOF)
      Sets the default language for highlighting code blocks

      If no language is set for a code block, the default language is used
      instead. The value has to be one of the languages supported by shiki
      or nil if no default language should be used.

      Default: plaintext
      Used by: HTML converter
    EOF
  end

  module Converter
    module SyntaxHighlighter
      # Uses Shiki (https://shiki.style/) to highlight code blocks.
      module Shiki
        def self.call(converter, text, lang, type, call_opts)
          return nil unless converter.options[:enable_shiki] and type == :block

          script = <<-JS
            async function generateCodeBlock(code, lang, theme = 'vitesse-light') {
                // require shiki module installed in project
                const { getHighlighter } = await import('shiki');
                const { rendererRich, transformerTwoslash } = await import('@shikijs/twoslash');

                const highlighter = await getHighlighter({ themes: [theme], langs: [lang]  });
                return highlighter.codeToHtml(code, {
                lang,
                theme,
                transformers: [
                    transformerTwoslash({
                        renderer: rendererRich()
                    })
                ]
                });
            }

            void (async () => {
                const [, ...args] = process.argv;
                // return output with console.log, so we can read it's output in ruby land
                console.log(await generateCodeBlock.apply(null, args));
            })();
          JS

          command = [
            "node",
            "-e",
            script,
            text,
            lang || converter.options[:shiki_default_lang],
          ]

          Open3.popen3(*command) do |stdin, stdout, stderr, wait_thr|
            # Read the output from stdout and stderr
            stdout_output = stdout.read
            stderr_output = stderr.read

            # Close streams to prevent deadlocks
            stdin.close
            stdout.close
            stderr.close

            # Wait for the command to finish and get the exit status
            exit_status = wait_thr.value

            if exit_status.success?
              stdout_output
            else
              Jekyll.logger.error("shiki:", stderr_output)
            end
          end
        end
      end
    end

    add_syntax_highlighter(:shiki, SyntaxHighlighter::Shiki)
  end
end
