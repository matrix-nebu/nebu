{ pkgs }:
let
  inherit (pkgs) writeShellApplication;
in
{
  check-signoff = writeShellApplication {
    name = "check-signoff";
    text = builtins.readFile ./check-signoff.sh;
    runtimeInputs = with pkgs; [
      gnugrep
      coreutils
    ];
  };
}
