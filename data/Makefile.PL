use strict;
use warnings;
use ExtUtils::MakeMaker;
my %make;
if ($ExtUtils::MakeMaker::VERSION > 6.64) {
$make{META_MERGE} = {
'meta-spec' => { version => 2 },
resources => {
repository => {
type => 'git',
url => 'https://github.com/JJ/IDC-keynote.git',
web => 'https://github.com/JJ/IDC-keynote',
},
},
};
}
WriteMakefile(
NAME => 'App::IDC-keynote',
AUTHOR => 'JJ Merelo <jj@merelo.net>',
LICENSE => 'gpl',
PL_FILES => {},
PREREQ_PM => {
'JSON' => 0,
'version' => 0,
'File::Slurp::Tiny' => 0,
},
%make,
);
