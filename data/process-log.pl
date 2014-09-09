#!/usr/bin/env perl

use File::Slurp::Tiny qw(read_file);
use JSON;
use v5.14;

my $file_name = shift || "log";

my $log_json = read_file( $file_name ) || die "Can't read file $file_name\n";

my $log = decode_json $log_json;

my %IPs;

for my $l (@$log ) {
    if ( $l->{'put'} ){
	$IPs{$l->{'IP'}}++
    };
}

say "IP;PUTs";
for my $k ( keys %IPs ) {
    say "$k;$IPs{$k}";
}
