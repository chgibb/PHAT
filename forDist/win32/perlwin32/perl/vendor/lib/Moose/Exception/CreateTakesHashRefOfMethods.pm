package Moose::Exception::CreateTakesHashRefOfMethods;
our $VERSION = '2.1807';

use Moose;
extends 'Moose::Exception';
with 'Moose::Exception::Role::RoleForCreate';

sub _build_message {
    "You must pass a HASH ref of methods";
}

1;
