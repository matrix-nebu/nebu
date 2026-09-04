{ pkgs, ... }:
{
  default = pkgs.mkShell {
    buildInputs = with pkgs; [
      nixfmt
      nodejs
      pnpm
    ];
  };
}
