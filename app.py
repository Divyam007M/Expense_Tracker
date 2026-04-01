import streamlit as st
import datetime
from graph import expense_graph, AgentState

st.set_page_config(page_title="Splitwise", layout="wide")

# Persistent State
if "expenses" not in st.session_state:
    st.session_state.expenses = []
if "group_members" not in st.session_state:
    st.session_state.group_members = ["Me", "Vedu"]

# Top level styling
st.title("💸 AI Expense tracker")
st.markdown("Track shared expenses naturally like: *'I paid ₹500 for dinner for me and Vedu.'*")

# SIDEBAR: Group Management
with st.sidebar:
    st.header("👥 Group Setup")
    
    new_member = st.text_input("Add a person to the group")
    if st.button("Add Person") and new_member:
        if new_member not in st.session_state.group_members:
            st.session_state.group_members.append(new_member)
            st.rerun()
            
    st.divider()
    st.subheader("Current Members")
    for idx, user_ in enumerate(st.session_state.group_members):
        c1, c2 = st.columns([3, 1])
        with c1:
            st.write(f"- {user_}")
        with c2:
            if st.button("❌", key=f"del_user_{idx}"):
                st.session_state.group_members.pop(idx)
                st.rerun()

# MAIN VIEW
col_left, col_right = st.columns([1, 1.2])

with col_left:
    st.header("Log a Shared Expense")
    
    with st.form("expense_form"):
        f_col1, f_col2, f_col3 = st.columns([1.5, 2.5, 1.5])
        with f_col1:
            who_input = st.text_input("Who spent?", placeholder="e.g. Vedu")
        with f_col2:
            what_input = st.text_input("On what?", placeholder="e.g. taxi for the group")
        with f_col3:
            amt_input = st.number_input("Rupees (₹)", min_value=0.0, step=10.0)
            
        btn_col1, btn_col2 = st.columns([1, 2])
        with btn_col1:
            submitted_addon = st.form_submit_button("Add on")
        with btn_col2:
            submitted_split = st.form_submit_button("Split between all")
        
    if (submitted_addon or submitted_split) and who_input and what_input:
        user_input = f"{who_input} spent ₹{amt_input} on {what_input}"
        if submitted_split:
            user_input += " for everyone"
        if not st.session_state.group_members:
            st.warning("Please add some group members in the sidebar first!")
        else:
            st.write("Splitting via AI...")
            current_date = datetime.date.today().isoformat()
            
            initial_state = AgentState(
                user_input=user_input,
                current_date=current_date,
                group_members=st.session_state.group_members,
                amount=0.0,
                description="",
                date="",
                payer="",
                involved=[],
                category="",
                summary_report="",
                expenses=st.session_state.expenses,
                logs=[]
            )
            
            with st.spinner("AI parsing..."):
                try:
                    # Execute workflow
                    final_state = expense_graph.invoke(initial_state)
                    st.session_state.expenses = final_state["expenses"]
                    
                    st.success("Expense processed successfully!")
                    with st.expander("Show AI extraction logs"):
                        for log in final_state.get("logs", []):
                            st.info(log)
                except Exception as e:
                    st.error(f"Error connecting to Ollama: {e}")

with col_right:
    st.header("Balance Sheet")
    
    # Calculate Splitwise Balances
    balances = {member: 0.0 for member in st.session_state.group_members}
    
    # Re-calculate on the fly: Payer gets +, Involved get - (share)
    for exp in st.session_state.expenses:
        payer = exp.get("payer")
        involved = exp.get("involved", [])
        amount = exp.get("amount", 0.0)
        
        # Add to payer tally
        if payer in balances:
            balances[payer] += amount
        else:
             # handle orphan payers temporarily
             balances[payer] = balances.get(payer, 0.0) + amount
             
        # Subtract from those who were involved equally
        if involved:
            split_amount = amount / len(involved)
            for person in involved:
                if person in balances:
                    balances[person] -= split_amount
                else:
                    balances[person] = balances.get(person, 0.0) - split_amount

    # Draw the balances
    st.subheader("Who owes who?")
    found_balances = False
    
    b_col1, b_col2 = st.columns([1,1])
    with b_col1:
        st.write("🟢 **Is Owed**")
        for mem, bal in balances.items():
            if bal > 0.01:
                st.success(f"{mem}: +₹{bal:.2f}")
                found_balances = True
    with b_col2:
        st.write("🔴 **Owes**")
        for mem, bal in balances.items():
            if bal < -0.01:
                st.error(f"{mem}: -₹{abs(bal):.2f}")
                found_balances = True
                
    if not found_balances:
         st.info("Balances are fully settled! 👍")

    st.divider()
    st.subheader("Ledger (Manage All)")
    if st.session_state.expenses:
        import pandas as pd
        
        df = pd.DataFrame(st.session_state.expenses)
        if 'involved' in df.columns:
            df['involved'] = df['involved'].apply(lambda x: ", ".join(x) if isinstance(x, list) else str(x))
            
        df['❌'] = False
        cols = ['❌'] + [c for c in df.columns if c != '❌']
        df = df[cols]
        
        edited_df = st.data_editor(
            df,
            key="ledger_table",
            use_container_width=True,
            hide_index=True,
            column_config={
                "❌": st.column_config.CheckboxColumn(
                    "❌ Remove",
                    help="Select your expenses to remove",
                    default=False,
                )
            },
            disabled=[c for c in df.columns if c != '❌']
        )
        
        if edited_df['❌'].any():
            to_remove = edited_df[edited_df['❌']].index.tolist()
            st.warning(f"⚠️ **Confirm Deletion:** Are you sure you want to drop {len(to_remove)} expense(s)?")
            confirm_c1, confirm_c2, _ = st.columns([1.5, 1.5, 7])
            with confirm_c1:
                if st.button("✅ Yes, remove", type="primary"):
                    for idx in sorted(to_remove, reverse=True):
                        st.session_state.expenses.pop(idx)
                    if 'ledger_table' in st.session_state:
                        del st.session_state['ledger_table']
                    st.rerun()
            with confirm_c2:
                if st.button("❌ Cancel"):
                    if 'ledger_table' in st.session_state:
                        del st.session_state['ledger_table']
                    st.rerun()
    else:
        st.write("No transaction history.")
