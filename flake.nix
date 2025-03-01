{
  description = "FreeSewing Design Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            (yarn.override { nodejs = nodejs_20; })
            # Additional build dependencies that might be needed
            pkg-config
            cairo
            pango
            libpng
          ];

          shellHook = ''
            if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
              echo "Installing dependencies..."
              yarn install
            fi
          '';

          # Add any necessary environment variables
          LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.cairo
            pkgs.pango
          ];
        };
      }
    );
}