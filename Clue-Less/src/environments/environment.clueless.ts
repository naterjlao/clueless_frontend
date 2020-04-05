/******************************************************************************
* File: environment.clueless.ts
* Language: TypeScript
* Author: Nate Lao (nlao1@jh.edu)
* Created On: 4/5/2020
* Description:
*        Custom configuration file for Project Clueless.
*        It is enabled using `ng build --configuration=clueless`
*        The callout must be specified in angular.json.
******************************************************************************/

export const environment = {
  production: true
};

// TODO this is to be blown away and modified through custom installation
// TODO ng build would have to be removed from preinst and postinst
export const network = {
  httpPort: "8080"
  serverIP: "http://john.natelao.com"
  serverPort: "3000"
};
