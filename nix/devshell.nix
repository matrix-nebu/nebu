args@{ pkgs, ... }:
let
  hooks = import ./hooks.nix args;
in
{
  default = hooks.wrapShell (
    pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs
        pnpm

        prettier
        eslint
        nixfmt
      ];
    }
  );
}
