package Moose::Exception::MustSupplyAnAccessorTypeToConstructWith;
our $VERSION = '2.1807';

use Moose;
extends 'Moose::Exception';
with 'Moose::Exception::Role::ParamsHash';

has 'class' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1
);

sub _build_message {
    "You must supply an accessor_type to construct with";
}

1;
