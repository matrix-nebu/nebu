{ nixpkgs, ... }:
{
  forAllSystems =
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
    in
    f:
    nixpkgs.lib.genAttrs systems (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      f { inherit pkgs system; }
    );
}
