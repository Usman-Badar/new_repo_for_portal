import React from "react";

import InvoiceBuilderUI from "./InvoiceBuilderUI";

export default function InvoiceBuilder( props ) {

  return (
    <>
      <InvoiceBuilderUI
        DefaultInfo={ props.DefaultInfo }
        MasterData={ props.MasterData }
        Items={props.Items}
        onChnageHandler={props.onChnageHandler}
        AddItem={props.AddItem}
        Amount={props.Amount}
        Item={props.Item}
        onDelete={props.onDelete}
        OnEdit={props.OnEdit}
        EditMode={props.EditMode}
        Total={props.Total}
        ShowTotal={ props.ShowTotal }
        Locations={ props.Locations }
        Companies={ props.Companies }
        changeLocation={ props.changeLocation }
        title={ props.title }
        Btns={ props.Btns }
        changeCompany={ props.changeCompany }
        ModalShow={ props.ModalShow }
        ShowHideModal={ props.ShowHideModal }
        HideReason={ props.HideReason }
        ShowReason={ props.ShowReason }
        ShowAttachments={ props.ShowAttachments }
      />
    </>
  );
}
