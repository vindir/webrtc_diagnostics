# encoding: utf-8

Adhearsion.config do |config|

  config.development do |dev|
    dev.platform.logging.level = :debug
  end

  # config.punchblock.platform = :freeswitch # Use FreeSWITCH
  # config.punchblock.password = "" # Your Inbound EventSocket password
  # config.punchblock.host = "127.0.0.1" # Your IES host
end

Adhearsion::Events.draw do
end

Adhearsion.router do
  route 'default', WebRTCEcho
end
