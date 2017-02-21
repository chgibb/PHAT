package Specio::Exporter;

use strict;
use warnings;

our $VERSION = '0.31';

use Specio::Helpers qw( install_t_sub );
use Specio::Registry
    qw( exportable_types_for_package internal_types_for_package register );

sub import {
    my $package  = shift;
    my $reexport = shift;

    my $caller = caller();

    my $exported = exportable_types_for_package($package);

    while ( my ( $name, $type ) = each %{$exported} ) {
        register( $caller, $name, $type->clone, $reexport );
    }

    install_t_sub(
        $caller,
        internal_types_for_package($caller),
    );
}

1;

# ABSTRACT: Base class for type libraries

__END__

=pod

=encoding UTF-8

=head1 NAME

Specio::Exporter - Base class for type libraries

=head1 VERSION

version 0.31

=head1 SYNOPSIS

    package MyApp::Type::Library;

    use parent 'Specio::Exporter';

    use Specio::Declare;

    declare( ... );

    # more types here

    package MyApp::Foo;

    use MyApp::Type::Library

=head1 DESCRIPTION

Inheriting from this package makes your package a type exporter. By default,
types defined in a package are never visible outside of the package. When you
inherit from this package, all the types you define internally become
available via exports.

The exported types are available through the importing package's C<t>
subroutine.

By default, types your package imports are not re-exported:

  package MyApp::Type::Library;

  use parent 'Specio::Exporter';

  use Specio::Declare;
  use Specio::Library::Builtins;

In this case, the types provided by L<Specio::Library::Builtins> are not
exported to packages which C<use MyApp::Type::Library>.

You can explicitly ask for types to be re-exported:

  package MyApp::Type::Library;

  use parent 'Specio::Exporter';

  use Specio::Declare;
  use Specio::Library::Builtins -reexport;

In this case, packages which C<use MyApp::Type::Library> will get all the
types from L<Specio::Library::Builtins> as well as any types defined in
C<MyApp::Type::Library>.

=head1 SUPPORT

Bugs may be submitted through L<https://github.com/houseabsolute/Specio/issues>.

I am also usually active on IRC as 'drolsky' on C<irc://irc.perl.org>.

=head1 AUTHOR

Dave Rolsky <autarch@urth.org>

=head1 COPYRIGHT AND LICENSE

This software is Copyright (c) 2016 by Dave Rolsky.

This is free software, licensed under:

  The Artistic License 2.0 (GPL Compatible)

=cut
