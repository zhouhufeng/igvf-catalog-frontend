# IGVF Catalog portal

Welcome to the frontend portal of IGVF Catalog, this portal aims to provide freely available mechanisms to access, search, query, and analyze the IGVF data.

## About IGVF

Understanding how genomic variation affects genome function to influence phenotypes is one of the central problems in biology. The [Impact of Genomic Variation on Function (IGVF) Consortium](https://igvf.org/) is to establish and develop a platform for systematically deciphering the effects of genomic variation on genome function and how these effects shape phenotypes.

## Data source

The potal is currently developed by the WashU-Northwestern DACC, and all data comes from the [IGVF catalog graph database](https://github.com/IGVF-DACC/igvf-catalog) hosted by the Stanford-Yale DACC. For more details about the data, please check their github repo.

## Development

To start a local instance of this portal, first install [nodejs](https://nodejs.org/en) and [yarn](https://classic.yarnpkg.com/en/), clone this portal, and run:

```sh
yarn install
yarn dev
```

```sh
yarn run v1.22.19
$ next dev
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

You can visit the portal with your web browser at <http://localhost:3000> then. IGVF members can email to ask database URL and credentials. Guest users can contact Stanford-Yale DACC for guest login information.

## Feedbacks/Suggestions?

All suggestions are welcome, please submit an [issue](./issue) request. Thank you!

