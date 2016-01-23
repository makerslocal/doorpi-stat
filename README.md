# DoorPi Status

A nodejs web portal to view uptime for the shop's auth computer.

The `ctag` user on doorpi has a `Resty` based shell script attached to a cron job. Every five minutes it will phone-home to dev. If it misses 15 minutes worth of those connections, dev will tally up 15 minutes of downtime all at once.

View at [dev:3001](http://dev.256.makerslocal.org:3001/check).