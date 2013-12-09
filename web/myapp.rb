require 'rubygems'
require 'bundler'
require 'coffee-script'

Bundler.require

require 'open-uri'

Sinatra.register SinatraMore::MarkupPlugin
Sinatra.register Sinatra::Twitter::Bootstrap::Assets

set :haml, :format => :html5

get '/' do
  haml :index, :layout => :layout
end

get '/scripts.js' do
  content_type "text/javascript"
  coffee :scripts
end
