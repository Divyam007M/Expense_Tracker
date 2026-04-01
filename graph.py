import json
import logging
from typing import TypedDict, List, Dict, Any
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, START, END

# Define the state that will be passed between agents
class AgentState(TypedDict):
    user_input: str
    current_date: str
    group_members: List[str]
    
    # Information extracted from the input
    amount: float
    description: str
    date: str
    payer: str
    involved: List[str]
    
    # Categorization
    category: str
    
    # General report output
    summary_report: str
    
    # Persistent mock database of expenses
    expenses: List[Dict[str, Any]]
    
    # Optional field to track the agent sequence output
    logs: List[str]


# Helper to parse JSON effectively
def safe_parse_json(text: str) -> dict:
    try:
        start_idx = text.find("{")
        end_idx = text.rfind("}")
        if start_idx != -1 and end_idx != -1:
            json_str = text[start_idx:end_idx+1]
            return json.loads(json_str)
        return json.loads(text)
    except json.JSONDecodeError:
        return {}


# Agent 1: Extracts structured Splitwise data from raw text
def extractor_node(state: AgentState):
    llm = ChatOllama(model="gpt-oss:120b-cloud", temperature=0.3)
    logs = state.get("logs", [])
    
    group_members = state.get("group_members", [])
    current_date = state.get("current_date", "")
    
    prompt = f"""You extract shared group expenses from text. 
    Current Date: {current_date}
    Valid Group Members: {', '.join(group_members)}
    
    User Input: "{state['user_input']}"
    
    Extract the following into a valid JSON object:
    1. "amount": total amount spent (number)
    2. "description": short description (string)
    3. "date": date of the transaction (string). If unspecified, explicitly default to '{current_date}' 
    4. "payer": the name of the person who paid (string, match one of the Group Members. If none implied, pick the first member)
    5. "involved": list of names who share the cost (list of strings). If the text implies "for everyone", "for us", or "for the group", include ALL Valid Group Members.
    
    Return ONLY the JSON string. No backticks.
    """
    
    response = llm.invoke([SystemMessage(content=prompt)])
    parsed_data = safe_parse_json(response.content)
    
    amount = float(parsed_data.get("amount", 0.0))
    description = parsed_data.get("description", "Unknown Expense")
    date = parsed_data.get("date", current_date)
    payer = parsed_data.get("payer", "")
    involved = parsed_data.get("involved", [])
    
    if not isinstance(involved, list):
        involved = []
        
    logs.append(f"Extractor Agent discovered: ₹{amount} paid by {payer} for {len(involved)} participants on {date}.")
    
    return {
        "amount": amount,
        "description": description,
        "date": date,
        "payer": payer,
        "involved": involved,
        "logs": logs
    }


# Agent 2: Categorizes the expense
def categorizer_node(state: AgentState):
    llm = ChatOllama(model="gpt-oss:120b-cloud", temperature=0.3)
    logs = state.get("logs", [])
    
    description = state.get("description", "")
    amount = state.get("amount", "")
    
    prompt = f"""Based on the description "{description}" for amount ₹{amount}, select the most logical category from:
    Food, Transport, Housing, Utilities, Subscriptions, Entertainment, Other.
    Return ONLY a JSON object with the key "category" (string).
    """
    
    response = llm.invoke([SystemMessage(content=prompt)])
    parsed_data = safe_parse_json(response.content)
    
    category = parsed_data.get("category", "Other")
    
    logs.append(f"Categorizer Agent assigned category: {category}")
    
    return {
        "category": category,
        "logs": logs
    }


# Agent 3: Saves the transaction into Group Expenses
def reporter_node(state: AgentState):
    logs = state.get("logs", [])
    expenses = state.get("expenses", [])
    
    # Save the new splitwise expense
    new_expense = {
        "date": state.get("date", ""),
        "amount": state.get("amount", 0.0),
        "description": state.get("description", ""),
        "category": state.get("category", ""),
        "payer": state.get("payer", ""),
        "involved": state.get("involved", [])
    }
    expenses.append(new_expense)
    
    report = f"Tracked: {new_expense['payer']} paid ₹{new_expense['amount']} for {', '.join(new_expense['involved'])}."
    logs.append("Reporter Agent saved the expense to the ledger.")
    
    return {
        "expenses": expenses,
        "summary_report": report,
        "logs": logs
    }

# Build the LangGraph
workflow = StateGraph(AgentState)

workflow.add_node("extractor", extractor_node)
workflow.add_node("categorizer", categorizer_node)
workflow.add_node("reporter", reporter_node)

workflow.add_edge(START, "extractor")
workflow.add_edge("extractor", "categorizer")
workflow.add_edge("categorizer", "reporter")
workflow.add_edge("reporter", END)

# Compile graph
expense_graph = workflow.compile()
