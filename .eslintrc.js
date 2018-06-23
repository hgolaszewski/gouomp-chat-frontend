module.exports = {
  "env": {
    "node": true,
    "jest": true,
    "es6": true
  },
  "plugins": [
    "react",
    "flowtype",
    "jsx-a11y",
    "import"
  ],
  "parser": "babel-eslint",
  "extends": "airbnb",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "globals": {
    "appUrl": false,
    "fetch": false
  },
  "rules": {
    "indent": ["error", 2],
    "react/jsx-filename-extension": [
      1, { "extensions": [".js", ".jsx"] }
    ],
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": 0,
    "react/no-did-mount-set-state": 1,
    "no-unused-expressions":[
      0, { "allowShortCircuit": false, "allowTernary": false }
    ]
  }
};