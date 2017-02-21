package Specio::Constraint::Role::CanType;

use strict;
use warnings;

our $VERSION = '0.31';

use Scalar::Util qw( blessed );
use Storable qw( dclone );

use Role::Tiny;

use Specio::Constraint::Role::Interface;
with 'Specio::Constraint::Role::Interface';

{
    ## no critic (Subroutines::ProtectPrivateSubs)
    my $attrs = dclone( Specio::Constraint::Role::Interface::_attrs() );
    ## use critic

    for my $name (qw( parent _inline_generator )) {
        $attrs->{$name}{init_arg} = undef;
        $attrs->{$name}{builder}
            = $name =~ /^_/ ? '_build' . $name : '_build_' . $name;
    }

    $attrs->{methods} = {
        isa      => 'ArrayRef',
        required => 1,
    };

    ## no critic (Subroutines::ProhibitUnusedPrivateSubroutines)
    sub _attrs {
        return $attrs;
    }
}

## no critic (Subroutines::ProhibitUnusedPrivateSubroutines)
sub _wrap_message_generator {
    my $self      = shift;
    my $generator = shift;

    my @methods = @{ $self->methods };

    unless ( defined $generator ) {
        $generator = sub {
            shift;
            my $value = shift;

            my $class = blessed $value;
            $class ||= $value;

            my @missing = grep { !$value->can($_) } @methods;

            my $noun = @missing == 1 ? 'method' : 'methods';
            my $list = _word_list( map {qq['$_']} @missing );

            return "$class is missing the $list $noun";
        };
    }

    my $d = $self->description;

    return sub { $generator->( $d, @_ ) };
}
## use critic

sub _word_list {
    my @items = shift;

    return $items[0] if @items == 1;
    return join ' and ', @items if @items == 2;

    my $final = pop @items;
    my $list = join ', ', @items;
    $list .= ', and ' . $final;

    return $list;
}

1;

# ABSTRACT: Provides a common implementation for Specio::Constraint::AnyCan and Specio::Constraint::ObjectCan

__END__

=pod

=encoding UTF-8

=head1 NAME

Specio::Constraint::Role::CanType - Provides a common implementation for Specio::Constraint::AnyCan and Specio::Constraint::ObjectCan

=head1 VERSION

version 0.31

=head1 DESCRIPTION

See L<Specio::Constraint::AnyCan> and L<Specio::Constraint::ObjectCan> for details.

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
