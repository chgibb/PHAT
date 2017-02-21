package Term::Table::Util;
use strict;
use warnings;

our $VERSION = '0.006';

use Importer Importer => 'import';
our @EXPORT_OK = qw/term_size USE_GCS USE_TERM_READKEY uni_length/;

sub DEFAULT_SIZE() { 80 }

sub try(&) {
    my $code = shift;
    local ($@, $?, $!);
    my $ok = eval { $code->(); 1 };
    my $err = $@;
    return ($ok, $err);
}

my ($trk) = try { require Term::ReadKey };
$trk &&= Term::ReadKey->can('GetTerminalSize');

if ($trk) {
    *USE_TERM_READKEY = sub() { 1 };
    *term_size = sub {
        return $ENV{TABLE_TERM_SIZE} if $ENV{TABLE_TERM_SIZE};

        my $total;
        try {
            my @warnings;
            {
                local $SIG{__WARN__} = sub { push @warnings => @_ };
                ($total) = Term::ReadKey::GetTerminalSize(*STDOUT);
            }
            @warnings = grep { $_ !~ m/Unable to get Terminal Size/ } @warnings;
            warn @warnings if @warnings;
        };
        return DEFAULT_SIZE if !$total;
        return DEFAULT_SIZE if $total < DEFAULT_SIZE;
        return $total;
    };
}
else {
    *USE_TERM_READKEY = sub() { 0 };
    *term_size = sub {
        return $ENV{TABLE_TERM_SIZE} if $ENV{TABLE_TERM_SIZE};
        return DEFAULT_SIZE;
    };
}

my ($gcs, $err) = try { require Unicode::GCString };

if ($gcs) {
    *USE_GCS    = sub() { 1 };
    *uni_length = sub   { Unicode::GCString->new($_[0])->columns };
}
else {
    *USE_GCS    = sub() { 0 };
    *uni_length = sub   { length($_[0]) };
}

1;

__END__

=pod

=encoding UTF-8

=head1 NAME

Term::Table::Util - Utilities for Term::Table.

=head1 DESCRIPTION

This package exports some tools used by Term::Table.

=head1 EXPORTS

=head2 CONSTANTS

=over 4

=item $bool = USE_GCS

True if L<Unicode::GCString> is installed.

=item $bool = USE_TERM_READKEY

True if L<Term::ReadKey> is installed.

=back

=head2 UTILITIES

=over 4

=item $width = term_size()

Get the width of the terminal.

If the C<$TABLE_TERM_SIZE> environment variable is set then that value will be
returned.

This will default to 80 if there is no good way to get the size, or if the size
is unreasonably small.

If L<Term::ReadKey> is installed it will be used.

=item $width = uni_length($string)

Get the width (in columns) of the specified string. When L<Unicode::GCString>
is installed this will work on unicode strings, otherwise it will just use
C<length($string)>.

=back

=head1 SOURCE

The source code repository for Term-Table can be found at
F<http://github.com/exodist/Term-Table/>.

=head1 MAINTAINERS

=over 4

=item Chad Granum E<lt>exodist@cpan.orgE<gt>

=back

=head1 AUTHORS

=over 4

=item Chad Granum E<lt>exodist@cpan.orgE<gt>

=back

=head1 COPYRIGHT

Copyright 2016 Chad Granum E<lt>exodist@cpan.orgE<gt>.

This program is free software; you can redistribute it and/or
modify it under the same terms as Perl itself.

See F<http://dev.perl.org/licenses/>

=cut
