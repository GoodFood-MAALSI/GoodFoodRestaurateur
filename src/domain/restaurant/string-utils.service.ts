// src/utils/string.utils.ts ou un nom similaire
export class StringUtils {
  /**
   * Remplace tous les espaces d'une chaîne de caractères par le caractère '+'.
   * @param inputString La chaîne de caractères à traiter.
   * @returns La chaîne de caractères avec les espaces remplacés par '+'.
   */
  static replaceSpacesWithPlus(inputString: string): string {
    if (inputString === null || typeof inputString === 'undefined') {
      // Gérer les cas null ou undefined, par exemple en retournant une chaîne vide ou en lançant une erreur
      return ''; 
    }
    return inputString.replace(/ /g, '+');
  }

  /**
   * Remplace tous les espaces d'une chaîne de caractères par un caractère de remplacement spécifié.
   * @param inputString La chaîne de caractères à traiter.
   * @param replacement Le caractère ou la chaîne de remplacement (par défaut '+').
   * @returns La chaîne de caractères avec les espaces remplacés.
   */
  static replaceSpaces(inputString: string, replacement: string = '+'): string {
    if (inputString === null || typeof inputString === 'undefined') {
      return '';
    }
    // L'expression régulière / /g signifie:
    // / / : rechercher un espace
    // g : "global", pour remplacer TOUTES les occurrences, pas seulement la première
    return inputString.replace(/ /g, replacement);
  }
}