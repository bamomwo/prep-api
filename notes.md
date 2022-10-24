# Personal Notes

    Personal notes on prep api project. Contains reasons for project structure and functionality

## Why two controller files for user functionality

    user.js controller for all user related stuffs that does not deal with authentication
    auth.js controller for all user related stuff that deals with authentication.
    The alternative is to box all functionality in a single controller say user.js but not really recommended or ideal atleast for me.

## Abstract functionality from login

    Methods to generate signed tokens and to do password comparison are abstracted in the User model but not controllers. That way controllers are kept neat
