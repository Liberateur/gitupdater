# Git Updater

```
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install git -y
```

# Config

You need to create the `config.js` file on the example of `config.sample.js`.

## Config params

- `branch` : Name of the branch that triggers the update or false if all
- `cwd`    : Path to the repo
- `logs`   : Log file path
- `after`  : Function async after execute update or false

