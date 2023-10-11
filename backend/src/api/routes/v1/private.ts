import { Router } from "express";
import { checkJwt } from "../../middlewares/auth/checkJwt";
import { deleteMemberFromGroup, editGroupInfo, getGroups, groupsInfo, inviteUsersToGroup, usersGroup } from "../../controllers/private/groups";
import { createList, lists } from "../../controllers/private/lists";
import { changeStatus, createItem, deleteItem, getItems, editItem } from "../../controllers/private/items";
import { createGroup } from "../../controllers/private/group/create";
import searchUsers from "../../controllers/private/searchUsers";
import { getLastModifiedLists } from "../../controllers/private/list/lastModified";


const privateRouter: Router = Router();

privateRouter.route('/users/search').get([checkJwt], searchUsers)

privateRouter.route('/groups').get([checkJwt], getGroups)
privateRouter.route('/lists/last').get([checkJwt], getLastModifiedLists)
privateRouter.route('/groups/create').post([checkJwt], createGroup)

privateRouter.route('/groups/:id/users').get([checkJwt], usersGroup)
privateRouter.route('/groups/:id/lists').get([checkJwt], lists)

privateRouter.route('/groups/:groupId/info').get([checkJwt], groupsInfo)
privateRouter.route('/groups/:groupId/info/edit').put([checkJwt], editGroupInfo)

privateRouter.route('/groups/:groupId/members/add').put([checkJwt], inviteUsersToGroup)
privateRouter.route('/groups/:groupId/members/delete').delete([checkJwt], deleteMemberFromGroup)

privateRouter.route('/groups/:groupId/lists/create').post([checkJwt], createList)
privateRouter.route('/groups/:groupId/lists/:listId/items').get([checkJwt], getItems)

privateRouter.route('/groups/:groupId/lists/:listId/items/create').post([checkJwt], createItem)
privateRouter.route('/groups/:groupId/lists/:listId/items/:itemId/edit').put([checkJwt], editItem)
privateRouter.route('/groups/:groupId/lists/:listId/items/:itemId/delete').delete([checkJwt], deleteItem)
privateRouter.route('/groups/:groupId/lists/:listId/items/:itemId/change').put([checkJwt], changeStatus)

export default privateRouter;