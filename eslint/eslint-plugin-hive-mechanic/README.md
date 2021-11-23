# eslint-plugin-hive-mechanic

Additional ESLint features for Hive Mechanic cards

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-hive-mechanic`:

```sh
npm install eslint-plugin-hive-mechanic --save-dev
```

## Usage

Add `hive-mechanic` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "hive-mechanic"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "hive-mechanic/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


