# Badges

## Définition d'une image joyeuse

L'idée d'une image "joyeuse" étant subjective, j'ai défini la mienne. La "joyeuseté" d'une image ici est défini par la présence dominante d'une couleur chaude (du jaune au pourpre) et vive (saturée et lumineuse). J'ai donc défini trois variables :
- warm : la chaleur d'une image, que j'ai approximé ici par la distance entre la couleur rouge et la moyenne des couleurs, en considérant que pour qu'une image soit chaude, elle doit être dominée par du rouge, en dépassant un certain seuil WARM_THRESHOLD (défini arbitrairement).
``r - (r + g + b) / 3` > WARM_THRESHOLD``
- luminosity : la luminosité d'une image, comprise entre 0 et 1, doit dépasser un seuil LUMINOSITY_THRESHOLD, définie par : 
``M / 255, avec M = max(r, g, b)``
- saturation : la saturation d'une image, comprise entre 0 et 1, doit dépasser un seuil SATURATION_THRESHOLD, définie  : 
``(M - m) / M, avec M = max(r, g, b) et m = min(r, g, b)``

La dominance d'une couleur dans une image est définie par la moyenne des couleurs d'une image. Nous aurions pu utiliser la méthode getColor() de la librairie Color Thief, que je n'ai pas utilisé car la présence de pixel transparent a une influence sur le résultat.
 
Nous aurions pu définir la joyeuseté par rapport à sa luminosité par exemple, ou par rapport à une teinte en particulier (en convertissant le RVB en HSL), ou utiliser des méthodes en traitements d'image bien plus complexes (détection de visage, sourire, ...). 

## Variables

Nous pouvons redéfinir certaines variables dans ``./config.js`` :
- SATURATION_THRESHOLD : [0 - 1], le seuil à dépasser pour qu'une image soit considérée "happy"
- LUMINOSITY_THRESHOLD : [0 - 1], le seuil à dépasser pour qu'une image soit considérée "happy"
- WARM_THRESHOLD : le seuil à dépasser pour qu'une image soit considérée "happy"
- TOLERANCE : Des traitements anti-aliasing sur une image (dont sur le cercle voulu) peut créer un "flou" des contours du cercle voulu, pour éviter un contour effet "escalier", la tolérance permet de palier aux soucis liés à l'anti-aliasing.
- SIZE_AVATAR : En admettant qu'un avatar soit toujours un cercle dans un carré, on peut définir la taille du coté de ce dernier, qui sera également le diamètre du cercle à l'intérieur.
