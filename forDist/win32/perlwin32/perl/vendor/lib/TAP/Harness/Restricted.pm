use 5.008001;
use strict;
use warnings;

package TAP::Harness::Restricted;
# ABSTRACT: Skip some test files
our $VERSION = '0.003'; # VERSION

use superclass 'TAP::Harness' => 3.18;
use Path::Tiny;

sub aggregate_tests {
    my ( $self, $aggregate, @tests ) = @_;
    my %banned_files = map { $_ => undef } map { glob } split " ",
      $ENV{HARNESS_SKIP} || '';
    @tests = grep { _file_ok( $_, \%banned_files ) } @tests;
    return $self->SUPER::aggregate_tests( $aggregate, @tests );
}

my $maybe_prefix = qr/(?:\d+[_-]?)?/;

my @banned_names =
  ( qr/${maybe_prefix}pod\.t/, qr/${maybe_prefix}pod[_-]?coverage\.t/, );

my @banned_code = (
    qr/use Test::Pod/, # also gets Test::Pod::Coverage
);

sub _file_ok {
    my $file         = path(shift);
    my $banned_files = shift;
    return unless $file->exists;
    my $basename = $file->basename;
    return if grep { $basename =~ $_ } @banned_names;
    return if exists $banned_files->{ $file->relative };
    my $guts = $file->slurp;
    return if grep { $guts =~ m{$_}ms } @banned_code;
    return 1;
}

1;


# vim: ts=4 sts=4 sw=4 et:

__END__

=pod

=encoding UTF-8

=head1 NAME

TAP::Harness::Restricted - Skip some test files

=head1 VERSION

version 0.003

=head1 SYNOPSIS

    # command line
    $ HARNESS_SUBCLASS=TAP::Harness::Restricted make test

    # bashrc file
    export HARNESS_SUBCLASS=TAP::Harness::Restricted

=head1 DESCRIPTION

This module is a trivial subclass of L<TAP::Harness>.  It overrides the
C<aggregate_tests> function to filter out tests that I didn't want getting in
the way of module installation.

The current criteria include:

=over 4

=item *

File names that look like F<pod.t> or F<pod-coverage.t>, with optional leading numbers

=item *

Files that contain the text C<use Test::Pod>

=item *

Files matching any of the space-separated glob patterns in C<$ENV{HARNESS_SKIP}>

=back

Suggestions for other annoying things to filter out are welcome.

If someone is inclined to make this extensible so people can put their own criteria into
configuration files, please email the author with ideas before sending a patch.

=for Pod::Coverage method_names_here

=for :stopwords cpan testmatrix url annocpan anno bugtracker rt cpants kwalitee diff irc mailto metadata placeholders metacpan

=head1 SUPPORT

=head2 Bugs / Feature Requests

Please report any bugs or feature requests through the issue tracker
at L<https://github.com/dagolden/TAP-Harness-Restricted/issues>.
You will be notified automatically of any progress on your issue.

=head2 Source Code

This is open source software.  The code repository is available for
public review and contribution under the terms of the license.

L<https://github.com/dagolden/TAP-Harness-Restricted>

  git clone https://github.com/dagolden/TAP-Harness-Restricted.git

=head1 AUTHOR

David Golden <dagolden@cpan.org>

=head1 CONTRIBUTOR

Dagfinn Ilmari Mannsåker <ilmari@ilmari.org>

=head1 COPYRIGHT AND LICENSE

This software is Copyright (c) 2013 by David Golden.

This is free software, licensed under:

  The Apache License, Version 2.0, January 2004

=cut
