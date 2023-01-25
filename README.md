
# Marioboard

## Description

Le but de ce projet est de réaliser un petit jeu de plateforme 2D en utilisant la plateforme Ingescape pour gérer la communication.

### Scénario

**Prérequis**

1. L'application whiteboard doit être lancée, c'est elle qui fait office de serveur et diffuse les informations aux Marioboard.
2. Il faut ensuite démarrer un proxy websocket qui écoute à l'adresse ws://localhost:5001 

**Les utilisateurs peuvent ensuite se connecter :**

1. A la connexion le Marioboard récupère la liste des éléments déjà présent sur le whiteboard (appel du service `getElements`).
2. Il crée par ailleurs un objet spécial qui représente le joueur et conserve son id.
3. A chaque clic sur le marioboard une plateforme sera créée. Le Marioboard attend le retour du whiteboard pour l'afficher effectivement à l'écran.
4. Les autres utilisateurs verront aussi la nouvelle plateforme ils écoutent l'output `lastAction` du whiteboard.
5. Lorsque le joueur se déplace sur le marioboard, il envoie périodiquement une requête au whiteboard pour mettre à jour sa position avec l'ID précédement obtenu (service `moveTo`).
6. Les autres utilisateurs en sont informés, toujours grâce à l'output `lastAction` du whiteboard.
7. TODO : évènement de victoire

## TODO

- [ ] Enregistrer les éléments dans la collection (hashmap)
- [ ] Réagir à la suppression des éléments depuis le whiteboard
- [ ] Afficher le Mario et le translate

### Améliorations

- [ ] Mode multijoueur
- [ ] Réagir au translate des éléments depuis le whiteboard
- [ ] Gestion connexion et déconnexion
- [ ] Changer l'image du mario grâce à un autre groupe
- [ ] Intégrer les flots de données. Par exemple envoyer un output message au chat ou input gravity.
