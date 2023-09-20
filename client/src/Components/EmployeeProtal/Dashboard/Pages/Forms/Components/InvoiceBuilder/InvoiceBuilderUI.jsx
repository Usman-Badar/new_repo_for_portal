import React, { useEffect } from "react";
import InputFields from "./Components/InputFields/InputFields";
import Modal from "../../../../../../UI/Modal/Modal";

import "./InvoiceBuilderUI.css";
import $ from 'jquery';

function InvoiceBuilderUI(props) {
  const d = new Date();

  useEffect(
    () => {

      var input = document.querySelector('input');
      if (input !== null) {
        input.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
        resizeInput.call(input); // immediately call the function

        function resizeInput() {
          this.style.width = this.value.length + "ch";
        }
      }
    }, []
  )

  return (
    <div className="InvoiceBuilder">
      <Modal show={props.ModalShow} Hide={props.ShowHideModal} content={
        <div>
          <div>
            <div>
              <div>
                <div>
                  <p>Description</p>
                  <input
                    onChange={props.onChnageHandler}
                    onKeyDown={props.AddItem}
                    type="text"
                    value={props.Item.description}
                    placeholder="Description"
                    name="description"
                    className="form-control"
                  />
                </div>
                <div>
                  <p>Reason</p>
                  <input
                    onChange={props.onChnageHandler}
                    onKeyDown={props.AddItem}
                    type="text"
                    value={props.Item.reason}
                    placeholder="Reason"
                    name="reason"
                    className="form-control"
                  />
                </div>
                <div>
                  <p>Price</p>
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
                </div>
                <div>
                  <p>Quantity</p>
                  <input
                    onChange={props.onChnageHandler}
                    onKeyDown={props.AddItem}
                    type="text"
                    value={props.Item.quantity}
                    placeholder="Item Quantity"
                    pattern="[0-9]+"
                    name="quantity"
                    className="form-control"
                  />
                </div>
                <div>
                  <p>Amount</p>
                  <input
                    type="text"
                    value={props.Amount}
                    placeholder="Item Amount"
                    pattern="[0-9]+"
                    name="amount"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      } />
      <div>
        <div className="title">
          <h2>{props.title}</h2>
        </div>
        {
          props.DefaultInfo
            ?
            <div className="upper">
              <div>
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon3">
                    Date
                  </span>
                  <input
                    type="date"
                    value={
                      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
                    }
                    className="form-control"
                    name=""
                    disabled
                  />
                </div>
              </div>
              <div>
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon3">
                    Company
                  </span>
                  <select className="form-control" name="companies" onChange={ props.changeCompany }>
                    {
                      props.Companies.length > 0
                        ?
                        props.Companies.map(
                          (val, index) => {

                            return (
                              <option key={index} value={ val.company_code } selected={ props.DefaultInfo.empCompany === val.company_code ? true : false }> { val.company_name } </option>
                            )

                          }
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
              <div>
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon3">
                    Delivery Location
                  </span>
                  <select className="form-control" name="empLocation" onChange={props.changeLocation}>
                    {
                      props.Locations.length > 0
                        ?
                        props.Locations.map(
                          (val, index) => {

                            return (
                              <option key={index} value={val.location_code}> {val.location_name} </option>
                            )

                          }
                        )
                        :
                        null
                    }
                  </select>
                </div>
              </div>
            </div>
            :
            props.MasterData.RequestInfo
              ?
              props.MasterData.RequestInfo.length === 0
                ?
                null
                :
                <div className="upper2">
                  {
                    props.MasterData.RequestInfo.map(
                      (val, index) => {

                        return (
                          <>
                            <div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-75">Request Date:</p>
                                <p className="mb-0 w-50"> { val.request_date ? val.request_date.substring(0,10) : null } </p>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-75">View Date:</p>
                                <p className="mb-0 w-50"> { val.view_date ? val.view_date.substring(0,10) : null } </p>
                              </div>
                              <div className="d-flex align-items-center">
                                {
                                  val.pr_status === 'Rejected'
                                  ?
                                  <p className="mb-0 font-weight-bold w-75">Rejected Date:</p>
                                  :
                                  <p className="mb-0 font-weight-bold w-75">Approve Date:</p>
                                }
                                <p className="mb-0 w-50"> { val.approve_date ? val.approve_date.substring(0,10) : val.pr_status === 'Waiting For Approval' ? val.pr_status : 'Not ' + val.pr_status } </p>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-50">Request By:</p>
                                <p className="mb-0 w-75"> { val.sender_name } </p>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-50">View By:</p>
                                <p className="mb-0 w-75"> { val.handle_emp_name } </p>
                              </div>
                              <div className="d-flex align-items-center">
                                {
                                  val.pr_status === 'Rejected'
                                  ?
                                  <p className="mb-0 font-weight-bold w-50">Rejected By:</p>
                                  :
                                  <p className="mb-0 font-weight-bold w-50">Approve By:</p>
                                }
                                <p className="mb-0 w-75"> { val.approve_emp_name ? val.approve_emp_name : val.pr_status === 'Waiting For Approval' ? val.pr_status : 'Not ' + val.pr_status } </p>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-50">Request For:</p>
                                <p className="mb-0 w-75"> { val.emp_for_name } </p>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-50">Location:</p>
                                <p className="mb-0 w-75"> { val.location_name } </p>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bold w-50">Company:</p>
                                <p className="mb-0 w-75"> { val.company_name } </p>
                              </div>
                            </div>
                          </>
                        )

                      }
                    )
                  }
                </div>
              :
            null
        }
      </div>
      {
        props.ShowAttachments
        ?
        <div className="pt-3">
          <h4>Attachments</h4>
          <div className="attachment_container">
            {
              props.MasterData.Attachments.map(
                ( val, index ) => {

                  console.log( val.file )

                  return (
                    <div key={ index }>
                      <div className="myattachments" style={ { backgroundImage: "url('" + val.file + "')" } }></div>
                    </div>
                  )
                } 
              )
            }
          </div>
        </div>
        :
          <div className="items_list">
            <div className="items_list_content">
              <div className="list" id="ItemsLIst">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Description</th>
                      {
                        props.HideReason
                          ?
                          null
                          :
                          <th>Reason</th>

                      }
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.Items.map((val, index) => {
                      return (
                        <>
                          <div>
                            <tr
                              key={index}
                              className={"items data itemsData" + index}
                            >
                              <td> {index + 1} </td>
                              <td> {val.description} </td>
                              {
                                props.HideReason
                                  ?
                                  null
                                  :
                                  <td className="HideReason">{val.reason}</td>

                              }
                              <td>{val.price}</td>
                              <td>{val.quantity}</td>
                              <td>{val.amount}</td>
                              <div className="abs">
                                <i
                                  className="lar la-edit"
                                  title="Edit"
                                  onClick={() => props.OnEdit(index)}
                                ></i>
                                <i
                                  className="las la-trash"
                                  title="Remove"
                                  onClick={() => props.onDelete(index)}
                                ></i>
                              </div>
                            </tr>
                          </div>
                          <div>
                            {
                              props.ShowReason
                                ?
                                <div className="ShowReason d-flex"><p className="font-weight-bolder mr-2">Reason :</p><p>{val.reason}</p></div>
                                :
                                null

                              }
                            </div>
                          <tr
                            key={index}
                            className={"items edition itemsEdit itemsEdit" + index}
                          >
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
                            <td >
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
                                placeholder="Item Quantity"
                                pattern="[0-9]+"
                                name="quantity"
                                className="form-control"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={props.Amount}
                                placeholder="Item Amount"
                                pattern="[0-9]+"
                                name="amount"
                                className="form-control"
                                disabled
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                    <div className="inputfields">
                      {props.EditMode ? null : (
                        <InputFields
                          onChnageHandler={props.onChnageHandler}
                          AddItem={props.AddItem}
                          Item={props.Item}
                          Amount={props.Amount}
                        />
                      )}
                    </div>
                  </tbody>
                </table>
              </div>
              <div className="ItemReqButton">
                <button
                  className="btn saveBtn"
                  onClick={props.ShowHideModal}
                  style={
                    {
                      backgroundColor: '#0db8de',
                      color: '#fff'
                    }
                  }
                >
                  Request Item
                </button>
              </div>
              <div className="controls">
                <div>
                  {
                    props.ShowTotal
                      ?
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon3">
                        Total
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        disabled
                        name=""
                        value={props.Total}
                      />
                    </div>
                    :
                    null
                  }
                </div>
                <div className="text-right">
                  {
                    props.Btns.length === 0
                    ?
                    null
                    :
                    props.Btns.map(
                      ( val, index ) => {

                        return (
                          <>
                            {
                              val === null
                              ?
                              null
                              :
                                <button
                                  key={index}
                                  className="btn saveBtn"
                                  onClick={() => val.func()}
                                  style={
                                    {
                                      backgroundColor: val.bgColor === 'default' ? '#0db8de' : val.bgColor,
                                      color: val.color === 'default' ? '#fff' : val.color
                                    }
                                  }
                                >
                                  {val.txt}
                                </button>
                            }
                          </>
                        )

                      }
                    )
                  }
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  );
}

export default InvoiceBuilderUI;
