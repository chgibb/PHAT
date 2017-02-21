package Test::Specio;

use strict;
use warnings;

our $VERSION = '0.31';

use B ();
use IO::File;
use Scalar::Util qw( blessed looks_like_number openhandle );
use Specio::Library::Builtins;
use Specio::Library::Numeric;
use Specio::Library::Perl;
use Specio::Library::String;
use Test::Fatal;
use Test::More 0.96;

use Exporter qw( import );

our $ZERO    = 0;
our $ONE     = 1;
our $INT     = 100;
our $NEG_INT = -100;
our $NUM     = 42.42;
our $NEG_NUM = -42.42;

our $EMPTY_STRING  = q{};
our $STRING        = 'foo';
our $NUM_IN_STRING = 'has 42 in it';
our $INT_WITH_NL1  = "1\n";
our $INT_WITH_NL2  = "\n1";

our $SCALAR_REF = do {
    ## no critic (Variables::ProhibitUnusedVariables)
    \( my $var );
};
our $SCALAR_REF_REF = \$SCALAR_REF;
our $ARRAY_REF      = [];
our $HASH_REF       = {};
our $CODE_REF       = sub { };

our $GLOB_REF = \*GLOB;

our $FH;
## no critic (InputOutput::RequireBriefOpen)
open $FH, '<', $INC{'Test/Specio.pm'}
    or die "Could not open $INC{'Test/Specio.pm'} for the test";

our $FH_OBJECT = IO::File->new( $INC{'Test/Specio.pm'}, 'r' )
    or die "Could not open $INC{'Test/Specio.pm'} for the test";

our $REGEX      = qr/../;
our $REGEX_OBJ  = bless qr/../, 'BlessedQR';
our $FAKE_REGEX = bless {}, 'Regexp';

our $OBJECT = bless {}, 'Foo';

our $UNDEF = undef;

## no critic (Modules::ProhibitMultiplePackages)
{
    package _T::Thing;

    sub foo { }
}

our $CLASS_NAME = '_T::Thing';

{
    package _T::BoolOverload;

    use overload
        'bool' => sub { ${ $_[0] } },
        fallback => 0;

    sub new {
        my $bool = $_[1];
        bless \$bool, __PACKAGE__;
    }
}

our $BOOL_OVERLOAD_TRUE  = _T::BoolOverload->new(1);
our $BOOL_OVERLOAD_FALSE = _T::BoolOverload->new(0);

{
    package _T::StrOverload;

    use overload
        q{""} => sub { ${ $_[0] } },
        fallback => 0;

    sub new {
        my $str = $_[1];
        bless \$str, __PACKAGE__;
    }
}

our $STR_OVERLOAD_EMPTY      = _T::StrOverload->new(q{});
our $STR_OVERLOAD_FULL       = _T::StrOverload->new('full');
our $STR_OVERLOAD_CLASS_NAME = _T::StrOverload->new('_T::StrOverload');

{
    package _T::NumOverload;

    use overload
        q{0+} => sub { ${ $_[0] } },
        '+'   => sub { ${ $_[0] } + $_[1] },
        fallback => 0;

    sub new {
        my $num = $_[1];
        bless \$num, __PACKAGE__;
    }
}

our $NUM_OVERLOAD_ZERO        = _T::NumOverload->new(0);
our $NUM_OVERLOAD_ONE         = _T::NumOverload->new(1);
our $NUM_OVERLOAD_NEG         = _T::NumOverload->new(-42);
our $NUM_OVERLOAD_DECIMAL     = _T::NumOverload->new(42.42);
our $NUM_OVERLOAD_NEG_DECIMAL = _T::NumOverload->new(42.42);

{
    package _T::CodeOverload;

    use overload
        q{&{}} => sub { ${ $_[0] } },
        fallback => 0;

    sub new {
        my $code = $_[1];
        bless \$code, __PACKAGE__;
    }
}

our $CODE_OVERLOAD = _T::CodeOverload->new( sub { } );

{
    package _T::RegexOverload;

    use overload
        q{qr} => sub { ${ $_[0] } },
        fallback => 0;

    sub new {
        my $regex = $_[1];
        bless \$regex, __PACKAGE__;
    }
}

our $REGEX_OVERLOAD = _T::RegexOverload->new(qr/foo/);

{
    package _T::GlobOverload;

    use overload
        q[*{}] => sub { ${ $_[0] } },
        fallback => 0;

    sub new {
        my $glob = $_[1];
        bless \$glob, __PACKAGE__;
    }
}

{
    package _T::ScalarOverload;

    use overload
        q[${}] => sub { ${ $_[0] } },
        fallback => 0;

    sub new {
        my $scalar = $_[1];
        bless \$scalar, __PACKAGE__;
    }
}

our $SCALAR_OVERLOAD = _T::ScalarOverload->new('x');

{
    package _T::ArrayOverload;

    use overload
        q[@{}] => sub { $_[0] },
        fallback => 0;

    sub new {
        my $array = $_[1];
        bless $array, __PACKAGE__;
    }
}

our $ARRAY_OVERLOAD = _T::ArrayOverload->new( [ 1, 2, 3 ] );

{
    package _T::HashOverload;

    use overload
        q[%{}] => sub { $_[0] },
        fallback => 0;

    sub new {
        my $hash = $_[1];
        bless $hash, __PACKAGE__;
    }
}

our $HASH_OVERLOAD = _T::HashOverload->new( { x => 42, y => 84 } );

my @vars;

BEGIN {
    open my $fh, '<', $INC{'Test/Specio.pm'} or die $!;
    while (<$fh>) {
        push @vars, $1 if /^our (\$[A-Z0-9_]+)(?: +=|;)/;
    }
}

our @EXPORT_OK = ( @vars, qw( describe test_constraint ) );
our %EXPORT_TAGS = ( vars => \@vars );

sub test_constraint {
    my $type      = shift;
    my $tests     = shift;
    my $describer = shift || \&describe;

    local $Test::Builder::Level = $Test::Builder::Level + 1;

    $type = t($type) unless blessed $type;

    subtest(
        ( $type->name || '<anon>' ),
        sub {
            my $not_inlined = $type->_constraint_with_parents;

            my $inlined;
            if ( $type->can_be_inlined ) {
                $inlined = $type->_generated_inline_sub;
            }

            for my $accept ( @{ $tests->{accept} || [] } ) {
                my $described = $describer->($accept);

                ok(
                    $type->value_is_valid($accept),
                    "accepts $described using ->value_is_valid"
                );
                is(
                    exception { $type->($accept) },
                    undef,
                    "accepts $described using subref overloading"
                );
                ok(
                    $not_inlined->($accept),
                    "accepts $described using non-inlined constraint"
                );
                if ($inlined) {
                    ok(
                        $inlined->($accept),
                        "accepts $described using inlined constraint"
                    );
                }
            }

            for my $reject ( @{ $tests->{reject} || [] } ) {
                my $described = $describer->($reject);
                ok(
                    !$type->value_is_valid($reject),
                    "rejects $described using ->value_is_valid"
                );
                if ($inlined) {
                    ok(
                        !$inlined->($reject),
                        "rejects $described using inlined constraint"
                    );
                }
            }
        }
    );
}

sub describe {
    my $val = shift;

    return 'undef' unless defined $val;

    if ( !ref $val ) {
        return q{''} if $val eq q{};

        return looks_like_number($val)
            && $val !~ /\n/ ? $val : B::perlstring($val);
    }

    return 'open filehandle'
        if openhandle $val && !blessed $val;

    if ( blessed $val ) {
        my $desc = ( ref $val ) . ' object';
        if ( $val->isa('_T::StrOverload') ) {
            $desc .= ' (' . describe("$val") . ')';
        }
        elsif ( $val->isa('_T::BoolOverload') ) {
            $desc .= ' (' . ( $val ? 'true' : 'false' ) . ')';
        }
        elsif ( $val->isa('_T::NumOverload') ) {
            $desc .= ' (' . describe( ${$val} ) . ')';
        }

        return $desc;
    }
    else {
        return ( ref $val ) . ' reference';
    }
}

1;

# ABSTRACT: Test helpers for Specio

__END__

=pod

=encoding UTF-8

=head1 NAME

Test::Specio - Test helpers for Specio

=head1 VERSION

version 0.31

=head1 SYNOPSIS

  use Test::Specio qw( test_constraint :vars );

  test_constraint(
      t('Foo'), {
          accept => [ 'foo', 'bar' ],
          reject => [ 42,    {}, $EMPTY_STRING, $HASH_REF ],
      }
  );

=head1 DESCRIPTION

This package provides some helper functions and variables for testing Specio
types.

=head1 EXPORTS

This module provides the following exports:

=head2 test_constraint( $type, $tests, [ $describer ] )

This subroutine accepts two arguments. The first should be a Specio type
object. The second is hashref which can contain the keys C<accept> and
C<reject>. Each key should contain an arrayref of values which the type
accepts or rejects.

The third argument is optional. This is a sub reference which will be called
to generate a description of the value being tested. This defaults to calling
this package's C<describe> sub, but you can provide your own.

=head2 describe($value)

Given a value, this subroutine returns a string describing that value in a
useful way for test output. It know about the various classes used for the
variables exported by this package and will do something intelligent when such
a variable.

=head2 Variables

This module also exports many variables containing values which are useful for
testing constraints. Note that references are always empty unless stated
otherwise. You can import these variables individually or import all of them
with the C<:vars> import tag.

=over 4

=item * C<$ZERO>

=item * C<$ONE>

=item * C<$INT>

An arbitrary positive integer.

=item * C<$NEG_INT>

An arbitrary negative integer.

=item * C<$NUM>

An arbitrary positive non-integer number.

=item * C<$NEG_NUM>

An arbitrary negative non-integer number.

=item * C<$EMPTY_STRING>

=item * C<$STRING>

An arbitrary non-empty string.

=item * C<$NUM_IN_STRING>

An arbitrary string which contains a number.

=item * C<$INT_WITH_NL1>

An string containing an integer followed by a newline.

=item * C<$INT_WITH_NL2>

An string containing a newline followed by an integer.

=item * C<$SCALAR_REF>

=item * C<$SCALAR_REF_REF>

A reference containing a reference to a scalar.

=item * C<$ARRAY_REF>

=item * C<$HASH_REF>

=item * C<$CODE_REF>

=item * C<$GLOB_REF>

=item * C<$FH>

An opened filehandle.

=item * C<$FH_OBJECT>

An opened L<IO::File> object.

=item * C<$REGEX>

A regex created with C<qr//>.

=item * C<$REGEX_OBJ>

A regex created with C<qr//> that was then blessed into class.

=item * C<$FAKE_REGEX>

A non-regex blessed into the C<Regexp> class which Perl uses internally for
C<qr//> objects.

=item * C<$OBJECT>

An arbitrary object.

=item * C<$UNDEF>

=item * C<$CLASS_NAME>

A string containing a loaded package name.

=item * C<$BOOL_OVERLOAD_TRUE>

An object which overloads boolification to return true.

=item * C<$BOOL_OVERLOAD_FALSE>

An object which overloads boolification to return false.

=item * C<$STR_OVERLOAD_EMPTY>

An object which overloads stringification to return an empty string.

=item * C<$STR_OVERLOAD_FULL>

An object which overloads stringification to return a non-empty string.

=item * C<$STR_OVERLOAD_CLASS_NAME>

An object which overloads stringification to return a loaded package name.

=item * C<$NUM_OVERLOAD_ZERO>

=item * C<$NUM_OVERLOAD_ONE>

=item * C<$NUM_OVERLOAD_NEG>

=item * C<$NUM_OVERLOAD_DECIMAL>

=item * C<$NUM_OVERLOAD_NEG_DECIMAL>

=item * C<$CODE_OVERLOAD>

=item * C<$SCALAR_OVERLOAD>

An object which overloads scalar dereferencing to return a non-empty string.

=item * C<$ARRAY_OVERLOAD>

An object which overloads array dereferencing to return a non-empty array.

=item * C<$HASH_OVERLOAD>

An object which overloads hash dereferencing to return a non-empty hash.

=back

=head2 _T::GlobOverload package

This package is defined when you load C<Test::Specio> so you can create your
own glob overloading objects. Such objects cannot be exported because the glob
they return does not transfer across packages properly.

You can create such a variable like this:

  local *FOO;
  my $GLOB_OVERLOAD = _T::GlobOverload->new( \*FOO );

If you want to create a glob overloading object that returns filehandle, do
this:

  local *BAR;
  open BAR, '<', $0 or die "Could not open $0 for the test";
  my $GLOB_OVERLOAD_FH = _T::GlobOverload->new( \*BAR );

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
