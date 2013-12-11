require 'rubygems'
require 'bundler'
require 'coffee-script'

Bundler.require

require 'open-uri'

Sinatra.register SinatraMore::MarkupPlugin

set :haml, :format => :html5

get '/' do
  haml :index, :layout => :layout
end

get '/scripts.js' do
  content_type "text/javascript"
  coffee :scripts
end
