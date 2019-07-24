Gem::Specification.new do |s|
    s.name = %q{jekyll-babel}
    s.version = "0.0.1"
    s.authors = ['Eyo O. Eyo']
    s.date = %q{2011-09-29}
    s.summary = %q{jekyll-babel is a small util to transpile es6 files to es5}
    s.files = [
      "lib/jekyll-babel.rb"
    ]
    s.require_paths = ["lib"]

    s.add_runtime_dependency 'jekyll', '~> 3.8', '>= 3.8.5'
    s.add_runtime_dependency 'babel-transpiler', '~> 0.7', '>= 0.7.0'
  end