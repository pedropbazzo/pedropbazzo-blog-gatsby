---
title: Tech Talk
description: Sharing Knowledge 🌎
date: 2020-11-12
template: portfolio
image: ./event.png
---

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/tech-talk01.jpeg" />

### [EN-US] Organizing an application with React

## 👩🏼‍💻 [View structure in gits](https://gist.github.com/pedropbazzo/d39a1c8f5845d5daab36a70edb8ad2e3)

Folder Structure
================

Please note
------------

While this gist has been shared and followed for years, I regret not giving more background. It was originally a gist for the engineering org I was in, not a "general suggestion" for any React app.

Typically I avoid folders altogether. Heck, I even avoid new files. If I can build an app with one 2000 line file I will. New files and folders are a pain.

But when you're in a decently large organization where different development teams work within pretty well-defined feature boundaries of an application, I like the following approach but I would keep the feature folders flat, no route nesting.

Also, don't you dare throw this at your eng team and be like "this is the way". Make up your own minds and don't use me as some weird appeal to authority, I'm just an average dev like anybody else.

Motivations
-----------

- Clear feature ownership
- Module usage predictibility (refactoring, maintainence, you know
  what's shared, what's not, prevents accidental regressions,
  avoids huge directories of not-actually-reusable modules, etc)
- CI runs only the tests that matter (future)
- Code splitting (future)

How it works
------------

The file structure maps directly to the route hierarchy, which maps
directly to the UI hierarchy.

It's inverted from the model that we've used in other systems. If we
consider all folders being either a "generic" or a "feature" folder, we
only have one "feature" folder but many "generic" folders.

Examples of "feature" folders:

- Surveys
- Admin
- Users
- Author

Examples of "generic" folders:

- components
- helpers
- stores
- actions

Given this route config:

```js
var routes = (
  <Route name="App">
    <Route name="Admin">
      <Route name="Users"/>
      <Route name="Reports"/>
    </Route>
    <Route name="Course">
      <Route name="Assignments"/>
    </Route>
  </Route>
);
```

We would now set up our directories like this:

```
app
└── screens
    └── App
        └── screens
            ├── Admin
            │   └── screens
            │       ├── Reports
            │       └── Users
            └── Course
                └── screens
                    └── Assignments
```

Next, each of these screens has an `index.js` file, which is the file
that handles the entry into the screen, also known as a "Route Handler"
in react router. Its very much like a `Route` in Ember. We'll also have
some top-level application bootstrapping stuff at the root, like
`config/routes.js`.

```
app
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── screens
│       │   ├── Admin
│       │   │   ├── screens
│       │   │   │   ├── Reports
│       │   │   │   │   └── index.js
│       │   │   │   └── Users
│       │   │   │       └── index.js
│       │   │   └── index.js
│       │   └── Course
│       │       ├── screens
│       │       │   └── Assignments
│       │       │       └── index.js
│       │       └── index.js
│       └── index.js
└── index.js
```

With this structure, each screen has its own directory to hold its
modules. In other words, we've introduced "scope" into our application
file structure.

Each will probably have a `components` directory.

```
app
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── components
│       ├── screens
│       │   ├── Admin
│       │   │   ├── components
│       │   │   ├── screens
│       │   │   │   ├── Reports
│       │   │   │   │   ├── components
│       │   │   │   │   └── index.js
│       │   │   │   └── Users
│       │   │   │       ├── components
│       │   │   │       └── index.js
│       │   │   └── index.js
│       │   └── Course
│       │       ├── components
│       │       ├── screens
│       │       │   └── Assignments
│       │       │       ├── components
│       │       │       └── index.js
│       │       └── index.js
│       └── index.js
└── index.js
```

These components are used *only in the current screen*, not even the
child screens. So what about when you've got some shared components
between screens?

### Shared Modules

Every screen also has a "shared" generic directory. If its children
share any components with each other or the parent, we put the shared
code in "shared". Here is our growing app with some new shared, and not
shared modules.

```
app
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── components
│       ├── screens
│       │   ├── Admin
│       │   │   ├── components
│       │   │   ├── screens
│       │   │   │   ├── Reports
│       │   │   │   │   ├── components
│       │   │   │   │   ├── stores
│       │   │   │   │   │   └── ReportsStore.js
│       │   │   │   │   └── index.js
│       │   │   │   └── Users
│       │   │   │       ├── components
│       │   │   │       └── index.js
│       │   │   ├── shared
│       │   │   │   └── stores
│       │   │   │       ├── AccountStore.js
│       │   │   │       └── UserStore.js
│       │   │   └── index.js
│       │   └── Course
│       │       ├── components
│       │       ├── screens
│       │       │   └── Assignments
│       │       │       ├── components
│       │       │       └── index.js
│       │       └── index.js
│       ├── shared
│       │   └── components
│       │       ├── Avatar.js
│       │       └── Icon.js
│       └── index.js
├── shared
│   └── util
│       └── createStore.js
└── index.js
```

Note `Admin/shared`; `Reports` and `Users` can both access the shared
stores. Additionally, every screen in the app can use `Avatar.js` and `Icon.js`.

We put shared components in the nearest `shared` directory possible and
move it toward the root as needed.

### Shared module resolution

The way modules in CommonJS are resolved is pretty straightforward in
practice: its all relative from the current file.

There is one piece of "magic" in the way modules resolve. When you do a
non-relative require like `require('moment')` the resolver will first
try to find it in `node_modules/moment`. If its not there, it will look
in `../node_modules/moment`, and on up the tree until it finds it.

We've made it so that `shared` resolves the same way with webpack
`modulesDirectories`. This way you don't have to
`require('../../../../../../../../../../shared/Avatar')` you can simply
do `require('components/Avatar')` no matter where you are.

### Tests

Tests live next to the modules they test. Tests for
`shared/util/createStore.js` live in `shared/util/__tests__/createStore.test.js`.

Now our app has a bunch of `__tests__` directories:

```
app
├── __tests__
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── components
│       │   ├── __tests__
│       │   │   └── AppView.test.js
│       │   └── AppView.js

... etc.

├── shared
│   └── util
│       ├── __tests__
│       │   └── createStore.test.js
│       └── createStore.js
└── index.js
```

### Why "Screens"?

The other option is "views", which has become a lot like "controller".
What does it even mean? Screen seems pretty intuitive to me to mean "a
specific screen in the app" and not something that is shared. It has the
added benefit that there's no such thing as an "MSC" yet, so the word
"screen" causes people to ask "what's a screen?" instead of assuming
they know what a "view" is supposed to be.

---

# <center>Portfolio</center>

## Some projects in my Portfolio

## 📱 Mobile

Application developed for Lóreal Paris - Dermaclub for Android and IOS platform

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/logo.png">
    <br>
    <img alt="GitHub language count" src="https://img.shields.io/badge/dermaclub/v1-brightgreen">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
</h3>


# Index

- [On](#sobre)
- [Technology Used](#tecnologias-utilizadas)
- [How to use](#como-usar)

<a id="sobre"></a>

## 📚 On

<strong>Dermaclub</strong>is a mobile application developed to bring another option to Loreal's customer<br><br>

A club for those who love skin care. Here you win <strong>year-round discounts</strong>and your purchases are worth points to exchange for products from participating brands.
<br><br>

<h3>Here you can find the brands most recommended by dermatologists</h3>

<br>

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/LRP.png">
    <br><br>
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/VCY.png">
    <br><br>
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/SKC.png">
    <br><br>
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/cerave-logo.png">
    <br><br>
</h3>

<a id="tecnologias-utilizadas"></a>

## 🚀 Technologies Used

The project was developed using the following technologies

- [React Native](https://reactnative.dev/) <br>
  Foram utilizado aqui:

  - @babel/runtime;
  - @expo/vector-icons;
  - @react-native-community/async-storage;
  - @react-native-community/checkbox;
  - @react-native-community/datetimepicker;
  - @react-native-community/masked-view;
  - @react-native-community/viewpager;
  - @react-native-firebase/app;
  - @react-native-firebase/auth;
  - @react-native-firebase/firestore;
  - @react-native-firebase/storage;
  - @react-navigation/bottom-tabs;
  - @react-navigation/drawer;
  - @react-navigation/native;
  - @react-navigation/stack;
  - @rimiti/react-native-toastify;
  - axios;
  - expo;
  - expo-asset;
  - expo-constants;
  - expo-facebook;
  - expo-font;
  - expo-linear-gradient;
  - expo-permissions;
  - expo-secure-store;
  - expo-status-bar;
  - firebase;
  - formik;
  - moment;
  - native-base;
  - react;
  - react-dom;
  - react-moment;
  - react-native;
  - react-native-dotenv;
  - react-native-easy-toast;
  - react-native-elements;
  - react-native-fbsdk;
  - react-native-gesture-handler;
  - react-native-google-recaptcha-v2;
  - react-native-masked-text;
  - react-native-modal;
  - react-native-paper;
  - react-native-passmeter;
  - react-native-reanimated;
  - react-native-responsive-screen;
  - react-native-safe-area-context;
  - react-native-screens;
  - react-native-simple-radio-button;
  - react-native-slideshow;
  - react-native-swiper;
  - react-native-vector-icons;
  - react-native-web;
  - react-native-webview;
  - react-redux;
  - redux;
  - styled-components;
  - yup;

<a id="como-usar"></a>

## :fire: Como usar

- ### **Pré-requisitos**

  - É **necessário** possuir o **[Node.js](https://nodejs.org/en/)** instalado na máquina
  - Também, é **preciso** ter um gerenciador de pacotes seja o **[NPM](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**.

1. Executando a Aplicação:

```sh
  # Instale as dependências
  $ npm install

  # Inicie a aplicação mobile
  $ cd loreal.digital.aplicativo
  $ npm start
```

## :memo: License

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## 👨‍💻  [Developed by:](https://github.com/pedropbazzo/) 

<h3 align="center">
    <img alt="Avatar" title="#pedropbazzo" width="140px" src="https://avatars.githubusercontent.com/u/32115702?s=460&u=18b6f3c1f7fb02331ad007fd21a6fdd1c2105790&v=4">
    <br><br>
    <br>
</h3>

---

## 👨‍💻 [Click to view some projects open source from my portfolio](https://github.com/pedropbazzo/)

<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.1972%;"><iframe src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen scrolling="no" allow="encrypted-media"></iframe></div>

