# Archetype Validator

Independent regular and VIP character-annotation interfaces, copied from the existing GRAFIT validator. The original GRAFIT pages are retained unchanged.

- Regular: https://grafitctu.github.io/archetype-validator/
- VIP: https://grafitctu.github.io/archetype-validator/vip/
- Regular list: 388 records; VIP list: 424 records. Existing character IDs are retained, including Arthur Morgan’s `arthur_morgan`.
- Order after Gordon Freeman: Logan / Wolverine, Dylan Faden, Jesse Faden, Enzo Favara, V, Alan Wake, then Chell.

## Storage

Both interfaces use the existing Google Apps Script endpoint in their config.js. Regular submissions explicitly target `responses` with variant `public`; VIP submissions target `responses_vip` with variant `vip`. No historical response exports are stored in this repository.

Local progress and new local backups use the `standalone_` namespace (and separate VIP keys). An existing participant identifier and progress may be read once as a starting point; original GRAFIT storage is never overwritten. New local response logs start separately. The one-time ordering migration preserves the current character.

The interface sends requests with `no-cors`; its sent status alone does not prove server-side storage. Release verification must inspect the corresponding rows in Google Sheets. Character IDs, rather than historical response indices, identify records across versions.

## Source and deployment

Source: https://github.com/grafitctu/grafitctu.github.io/tree/1dc0753588452e0d03fc465d4979cd730c0757bc/archetype-validator-git and its VIP sibling. Relative VIP asset paths are adapted for this repository. GitHub Pages publishes the main branch root; `.nojekyll` keeps this static site lightweight.
