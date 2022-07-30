## gfycat

![npm](https://img.shields.io/npm/v/gfycat?color=blue) ![GitHub](https://img.shields.io/github/license/matthamil/gfycat?color=blue) [![CircleCI](https://dl.circleci.com/status-badge/img/gh/matthamil/gfycat/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/matthamil/gfycat/tree/main)

Unofficial Node JavaScript API wrapper written in TypeScript for [Gfycat.com](https://gfycat.com/) API.

## Table of Contents

- [Install](#development)
- [Features](#features)
- [Usage](#deploying)

## Install

This package requires [Node](https://nodejs.org/) version 14 or higher.

Install with npm

```
npm i gfycat
```

or yarn

```
yarn add gfycat
```

## Usage

Follow the steps in the [Gfycat API documentation](https://developers.gfycat.com/api/#quick-start) to obtain a client id and client secret.

See examples in the [`examples`](examples/) directory.

You can enable logging by setting the `DEBUG` environment variable to `gfycat`, i.e. `DEBUG=gfycat`.

## Features

This is a work-in-progress SDK. Not all APIs are implemented. The list of documented Gfycat API endpoints can be found in the [Gfycat API documentation](https://developers.gfycat.com/api/#introduction).

#### Authentication

- [x] [Client Credentials Grant](https://developers.gfycat.com/api/#client-credentials-grant) (currently, the GfyatClient only uses password grant authentication)
- [x] [Password Grant Authentication](https://developers.gfycat.com/api/#password-grant)
- [x] [Refreshing access token](https://developers.gfycat.com/api/#refreshing-access-tokens)
- [ ] [Checking if username is available / exists / is valid](https://developers.gfycat.com/api/#checking-if-the-username-is-available-username-exists-username-is-valid)
- [ ] [Checking if your user's email is verified or not](https://developers.gfycat.com/api/#checking-if-users-email-is-verified-or-not)
- [ ] [Send verification email](https://developers.gfycat.com/api/#sending-an-email-verification-request)
- [ ] [Send a password reset email](https://developers.gfycat.com/api/#send-a-password-reset-email)

#### Users

- [ ] [Getting a user's public details](https://developers.gfycat.com/api/#getting-the-user-s-public-details)
- [ ] [Getting authenticated user's details](https://developers.gfycat.com/api/#getting-the-authenticated-user-s-details)
- [ ] [Updating a user's details](https://developers.gfycat.com/api/#updating-user-39-s-details)
- [ ] [Uploading user's profile image](https://developers.gfycat.com/api/#uploading-user-39-s-profile-image)
- [ ] [Creating a new user account](https://developers.gfycat.com/api/#creating-a-new-user-account)
- [ ] [Following another user](https://developers.gfycat.com/api/#following-another-user)
- [ ] [Unfollowing a user](https://developers.gfycat.com/api/#unfollowing-a-user)
- [ ] [Checking if you follow a user](https://developers.gfycat.com/api/#checking-if-you-follow-a-user)
- [ ] [List all users you follow](https://developers.gfycat.com/api/#listing-all-users-you-follow)
- [ ] [List all users following you](https://developers.gfycat.com/api/#listing-all-users-following-you)
- [x] Get all of your likes

#### User Feeds

- [ ] [Listing the the feed of published gfycats for a user](https://developers.gfycat.com/api/#listing-the-the-feed-of-published-gfycats-for-a-user)
- [ ] [Listing the the private feed of all gfycats for a user](https://developers.gfycat.com/api/#listing-the-the-private-feed-of-all-gfycats-for-a-user)
- [ ] [Listing the timeline feed of all users you follow](https://developers.gfycat.com/api/#listing-the-timeline-feed-of-all-users-you-follow)

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
    - [ ] Update gfycat title
    - [ ] Delete gfycat title
    - [ ] Update gfycat description
    - [ ] Delete gfycat description
    - [ ] Get gfycat likes
    - [ ] Like a gfycat
    - [ ] Update/replace gfycat tags
    - [ ] Get gfycat domain whitelist
    - [ ] Update/replace gfycat domain whitelist
    - [ ] Get gfycat geo whitelist
    - [ ] Update/replace geo whitelist
    - [ ] Delete gfycat whitelist
    - [x] Update gfycat visibility
    - [ ] Update/replace gfycat nsfw flag
    - [ ] Delete a gfycat

#### Trending Feeds

- [ ] [Trending Gfycats](https://developers.gfycat.com/api/#trending-gfycats)
- [ ] [Algorithmically Trending Gfycats](https://developers.gfycat.com/api/#algorithmically-trending-gfycats)
- [ ] [Algorithmically Trending Tags](https://developers.gfycat.com/api/#algorithmically-trending-tags)

#### Search

- [ ] [Search Gfycats](https://developers.gfycat.com/api/#site-search)
- [ ] [User account search](https://developers.gfycat.com/api/#user-account-search)
