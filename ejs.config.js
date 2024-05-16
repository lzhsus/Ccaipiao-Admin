const production = process.env.NODE_ENV === 'production'

export const ejsConfig = {
  head: `
    <meta charset="UTF-8" />
    <meta name="renderer" content="webkit" />
    <meta name="force-rendering" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
  `,
  body: `
    <div id="app"></div>
    <script type="module" src="./index.js"></script>
  `,
}
