# :warning: This package is deprecated.

Gfycat is shutting down on September 1, 2023.

## gfycat

[![npm](https://img.shields.io/npm/v/gfycat?color=blue)](https://www.npmjs.com/package/gfycat) ![GitHub](https://img.shields.io/github/license/matthamil/gfycat?color=blue) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![CircleCI](https://dl.circleci.com/status-badge/img/gh/matthamil/gfycat/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/matthamil/gfycat/tree/main)

Unofficial Node JavaScript API wrapper written in TypeScript for [Gfycat.com](https://gfycat.com/) API. Why an unofficial SDK? The [official Gfycat JavaScript client](https://github.com/gfycat/gfycat-sdk) is incomplete and lacks TypeScript support.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)

## Install

This package requires [Node](https://nodejs.org/) version 14 or higher.

Install with [npm](https://www.npmjs.com/)

```
npm i gfycat
```

or [yarn](https://yarnpkg.com/)

```
yarn add gfycat
```

## Usage

See examples in the [`examples`](examples/) directory.

You will need a Gfycat API client id and client secret. Follow the steps in the [Gfycat API documentation](https://developers.gfycat.com/api/#quick-start) to obtain a client id and client secret.

You can enable logging by setting the `DEBUG` environment variable to `gfycat`, i.e. `DEBUG=gfycat` or `DEBUG=*`.

## Features

This is a work-in-progress SDK. Not all APIs are implemented. The list of documented Gfycat API endpoints can be found in the [Gfycat API documentation](https://developers.gfycat.com/api/#introduction).

#### Authentication

- [x] [Client Credentials Grant](https://developers.gfycat.com/api/#client-credentials-grant) (currently, the GfycatClient only uses password grant authentication)
- [x] [Password Grant Authentication](https://developers.gfycat.com/api/#password-grant)
- [x] [Refreshing access token](https://developers.gfycat.com/api/#refreshing-access-tokens)
- [x] [Checking if username is available / exists / is valid](https://developers.gfycat.com/api/#checking-if-the-username-is-available-username-exists-username-is-valid)
- [x] [Checking if your user's email is verified or not](https://developers.gfycat.com/api/#checking-if-users-email-is-verified-or-not)
- [x] [Send verification email](https://developers.gfycat.com/api/#sending-an-email-verification-request)
- [x] [Send a password reset email](https://developers.gfycat.com/api/#send-a-password-reset-email)

#### Users

- [x] [Getting a user's public details](https://developers.gfycat.com/api/#getting-the-user-s-public-details)
- [x] [Getting authenticated user's details](https://developers.gfycat.com/api/#getting-the-authenticated-user-s-details)
- [x] [Updating a user's details](https://developers.gfycat.com/api/#updating-user-39-s-details)
- [x] [Uploading user's profile image](https://developers.gfycat.com/api/#uploading-user-39-s-profile-image)
- [ ] [Creating a new user account](https://developers.gfycat.com/api/#creating-a-new-user-account)
- [x] [Following another user](https://developers.gfycat.com/api/#following-another-user)
- [x] [Unfollowing a user](https://developers.gfycat.com/api/#unfollowing-a-user)
- [x] [Checking if you follow a user](https://developers.gfycat.com/api/#checking-if-you-follow-a-user)
- [x] [List all users you follow](https://developers.gfycat.com/api/#listing-all-users-you-follow)
- [x] [List all users following you](https://developers.gfycat.com/api/#listing-all-users-following-you)
- [x] Get all of your likes

#### User Feeds

- [x] [Listing the the feed of published gfycats for a user](https://developers.gfycat.com/api/#listing-the-the-feed-of-published-gfycats-for-a-user)
- [x] [Listing the the private feed of all gfycats for a user](https://developers.gfycat.com/api/#listing-the-the-private-feed-of-all-gfycats-for-a-user)
- [x] [Listing the timeline feed of all users you follow](https://developers.gfycat.com/api/#listing-the-timeline-feed-of-all-users-you-follow)

#### Collections

> The collections APIs are undocumented.

- [x] Create a collection
- [x] Add to a collection
- [x] Remove from a collection
- [x] Delete a collection
- [x] Get a user's collections
- [x] Get gfycats in a collection

#### Gfycat

- [x] [Getting info for a single gfycat](https://developers.gfycat.com/api/#getting-info-for-a-single-gfycat)
  - [x] Get number of likes
- [x] Get your Gfycats
- [x] Get a user's Gfycats
- [x] [Creating Gfycats](https://developers.gfycat.com/api/#creating-gfycats)
  - [x] [Fetching a remote url to create a new gfycat](https://developers.gfycat.com/api/#fetching-a-remote-url-to-create-a-new-gfycat)
  - [x] [Checking the status of your upload](https://developers.gfycat.com/api/#checking-the-status-of-your-upload)
  - [x] [Uploading a file to create a new gfycat](https://developers.gfycat.com/api/#uploading-a-file-to-create-a-new-gfycat)
- [ ] [Updating Gfycats](https://developers.gfycat.com/api/#updating-gfycats)
  - [x] Update gfycat title
  - [x] Delete gfycat title
  - [x] Update gfycat description
  - [x] Delete gfycat description
  - [x] Get my gfycat like status
  - [x] Like my gfycat
  - [x] Update/replace gfycat tags
  - [ ] Get gfycat domain whitelist
  - [x] Update/replace gfycat domain whitelist
  - [ ] Get gfycat geo whitelist
  - [x] Update/replace geo whitelist
  - [x] Delete gfycat whitelist
  - [x] Update gfycat visibility
  - [x] Update/replace gfycat nsfw flag
  - [x] Delete a gfycat

#### Trending Feeds

- [x] [Trending Gfycats](https://developers.gfycat.com/api/#trending-gfycats)
- [x] [Algorithmically Trending Gfycats](https://developers.gfycat.com/api/#algorithmically-trending-gfycats)
- [x] [Algorithmically Trending Tags](https://developers.gfycat.com/api/#algorithmically-trending-tags)

#### Search

- [x] [Search Gfycats](https://developers.gfycat.com/api/#site-search)
- [x] [User account search](https://developers.gfycat.com/api/#user-account-search)

## Contributing

This project uses [commitizen](https://github.com/commitizen/cz-cli) and [semantic-release](https://github.com/semantic-release/semantic-release). When committing, please use `npm run commit` to let commitizen create your commit.
