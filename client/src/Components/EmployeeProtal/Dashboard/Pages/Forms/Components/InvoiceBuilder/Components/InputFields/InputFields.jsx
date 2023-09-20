import React from "react";

function InputFields(props) {
  return (
    <tr className="InputFeilds">
      <td></td>
      <td>
        <input
          onChange={props.onChnageHandler}
          onKeyDown={props.AddItem}
          type="text"
          value={props.Item.description}
          placeholder="Description"
          name="description"
          className="form-control"
        />
      </td>
      <td>
        <input
          onChange={props.onChnageHandler}
          onKeyDown={props.AddItem}
          type="text"
          value={props.Item.reason}
          placeholder="Reason"
          name="reason"
          className="form-control"
        />
      </td>
      <td>
        <input
          onChange={props.onChnageHandler}
          onKeyDown={props.AddItem}
          type="text"
          value={props.Item.price}
          placeholder="Price"
          pattern="[0-9]+"
          name="price"
          className="form-control"
        />
      </td>
      <td>
        <input
          onChange={props.onChnageHandler}
          onKeyDown={props.AddItem}
          type="text"
          value={props.Item.quantity}
          placeholder="Quantity"
          pattern="[0-9]+"
          name="quantity"
          className="form-control"
        />
      </td>
      <td>
        <input
          type="text"
          value={props.Amount}
          placeholder="Amount"
          pattern="[0-9]+"
          name="amount"
          className="form-control"
          disabled
        />
      </td>
    </tr>
  );
}

export default InputFields;
