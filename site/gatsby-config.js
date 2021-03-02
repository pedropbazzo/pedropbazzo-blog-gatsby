let siteMetadata = {
  title: `@pedropbazzo`,
  capitalizeTitleOnHome: true,
  logo: `/images/logo.png`,
  icon: `/images/icon.png`,
  titleImage: `/images/wall.jpg`,
  introTag: `Senior Software Engineer 🛡️`,
  description: `I work daily to create new front-end features for the Web system, for the mobile system with Android, IOS and back-end, creating and maintaining microservices on cloud.`,
  author: `@pedropbazzo`,
  blogItemsPerPage: 20,
  portfolioItemsPerPage: 20,
  darkmode: true,
  switchTheme: true,
  navLinks: [
    {
      name: "HOME",
      url: "/",
    },
    {
      name: "ABOUT",
      url: "/about",
    },
    {
      name: "BLOG",
      url: "/blog",
    },
    {
      name: "PORTFOLIO",
      url: "/portfolio",
    },
  ],
  footerLinks: [
    {
      name: "PRIVACY POLICY",
      url: "/privacy-policy",
    },
  ],
  social: [
    {
      name: "",
      icon: "",
      url: "",
    },
  ],
  contact: {
    api_url: "",
    /* Leave this completely empty (no space either) if you don't want a contact form. */
    description: `If you want to contact me for work purposes or if you have any questions send me an email. `,
    mail: "developerpedropbazzo@gmail.com",
    phone: "+55 15 998088356",
    address: "+55 \nSão Paulo",
  },
};

module.exports = {
  siteMetadata: siteMetadata,
  plugins: [
    {
      resolve: "gatsby-theme-elemental",
      options: {
        contentPath: "contents",
      },
    },
  ],
};
