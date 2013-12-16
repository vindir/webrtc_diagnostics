require 'rubygems'
require 'bundler'
require 'sass'

Bundler.require

require 'open-uri'

Sinatra.register SinatraMore::MarkupPlugin

set :haml, :format => :html5

get '/' do
  haml :index, :layout => :layout
end

get '/sssymboliconsblock.css' do
  scss :sssymboliconsblock
end
