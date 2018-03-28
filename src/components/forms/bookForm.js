import React from 'react';
import { bookType, funcType } from '../../config/types';
import { CircularProgress, DatePicker, MenuItem, SelectField, TextField } from 'material-ui';
import ChipInput from 'material-ui-chip-input'
import { formats, genres, languages } from '../../config/shared';
import { bookRef, booksRef, collectionsRef, local_uid } from '../../config/firebase';
import Cover from '../cover';

export default class BookForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      book: {
        bid: this.props.book.bid || '', 
        ISBN_13: this.props.book.ISBN_13 || 0, 
        ISBN_10: this.props.book.ISBN_10 || 0,
        title: this.props.book.title || '', 
        title_sort: this.props.book.title_sort || '', 
        subtitle: this.props.book.subtitle || '', 
        authors: this.props.book.authors || [], 
        format: this.props.book.format || '', 
        collections: this.props.book.collections || [],
        covers: this.props.book.covers || [], 
        lastEdit: new Date().getTime(),
        lastEditBy: local_uid,
        pages_num: this.props.book.pages_num || 0, 
        publisher: this.props.book.publisher || '', 
        publication: this.props.book.publication || '', 
        edition_num: this.props.book.edition_num || 0, 
        genres: this.props.book.genres || [], 
        languages: this.props.book.languages, 
        description: this.props.book.description || '', 
        incipit: this.props.book.incipit || '',
        readers_num: this.props.book.readers_num || 0,
        ratings_num: this.props.book.ratings_num || 0,
        rating_num: this.props.book.totalRating_num || 0,
        reviews_num: this.props.book.reviews_num || 0
      },
      isEditingDescription: false,
      isEditingIncipit: false,
      description_maxChars: 2000,
      incipit_maxChars: 2500,
      loading: false,
      errors: {},
      authError: '',
      changes: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if (nextProps.book) {
        this.setState({
          book: nextProps.book
        });
      }
    }
  }

  componentDidMount(props) {
    if (this.props.book.bid) {
      bookRef(this.props.book.bid).onSnapshot(snap => {
        this.setState({
          ...this.state,
          data: snap.data()
        });
      });
    }
  }

  onEditDescription = e => {
    e.preventDefault();
    this.setState({
      isEditingDescription: !this.state.isEditingDescription
    });
  }

  onEditIncipit = e => {
    e.preventDefault();
    this.setState({
      isEditingIncipit: !this.state.isEditingIncipit
    });
  }
  
  onChange = e => {
    this.setState({
      book: { ...this.state.book, [e.target.name]: e.target.value }, changes: true
    });
  };

  onChangeNumber = e => {
    this.setState({
      book: { ...this.state.book, [e.target.name]: parseInt(e.target.value, 10) }, changes: true
    });
  };

  onChangeSelect = key => (e, i, val) => {
		this.setState({ 
      book: { ...this.state.book, [key]: val }, changes: true
    });
  };

  onChangeDate = key => (e, date) => {
		this.setState({ 
      book: { ...this.state.book, [key]: String(date) }, changes: true
    });
  };
  
  onAddChip = (key, chip) => {
    this.setState({
      book: { ...this.state.book, [key]: [...this.state.book[key], chip] }, changes: true
    });
  };

  onDeleteChip = (key, chip) => {
    this.setState({
      //chips: this.state.chips.filter((c) => c !== chip)
      book: { ...this.state.book, [key]: this.state.book[key].filter((c) => c !== chip) }, changes: true
    });
  };
  
  onChangeMaxChars = e => {
    let leftChars = `${e.target.name}_leftChars`;
    let maxChars = `${e.target.name}_maxChars`;
    this.setState({
      ...this.state, 
      book: { ...this.state.book, [e.target.name]: e.target.value }, [leftChars]: this.state[maxChars] - e.target.value.length, changes: true
    });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.changes) {
      const errors = this.validate(this.state.book);
      this.setState({ errors });
      if (Object.keys(errors).length === 0) {
        this.setState({ loading: true });
        if (this.props.book.bid) {
          bookRef(this.props.book.bid).set(this.state.book).then(() => {
            this.setState({ 
              //redirectToReferrer: true,
              loading: false,
              changes: false
            });
            this.props.isEditing();
          }).catch(error => {
            this.setState({
              authError: error.message,
              loading: false
            });
          });
        } else {
          let newBookRef = booksRef.doc();
          newBookRef.set({
            ...this.state.book,
            bid: newBookRef.id,
            creationTime: new Date().getTime()
          }).then(() => {
            this.setState({
              loading: false,
              changes: false
            });
            this.props.isEditing();
          }).catch(error => {
            this.setState({
              authError: error.message,
              loading: false
            });
          });
        }
        if (this.state.book.collections) {
          this.state.book.collections.forEach(cid => {
            collectionsRef(cid).doc(this.state.book.bid).set({
              bid: this.state.book.bid || '', 
              bcid: 0, //CHECK NUMBER BEFORE WRITING
              covers: [this.state.book.covers[0]] || [],
              title: this.state.book.title || '',  
              subtitle: this.state.book.subtitle || '', 
              authors: this.state.book.authors || [], 
              publisher: this.state.book.publisher
            }).then(() => console.log('Collection set')).catch(error => console.warn(error));
          });
        }
      }
    } else {
      this.props.isEditing();
    }
  };

  validate = book => {
    const errors = {};
    if (!book.title) {
      errors.title = "Inserisci il titolo";
    } else if (book.title.length > 255) {
      errors.title = "Lunghezza massima 255 caratteri";
    }
    if (book.subtitle && book.subtitle.length > 255) {
      errors.subtitle = "Lunghezza massima 255 caratteri";
    }
    if (!book.authors) {
      errors.authors = "Inserisci l'autore";
    } else if (book.authors.length > 255) {
      errors.authors = "Lunghezza massima 255 caratteri";
    }
    if (!book.publisher) {
      errors.publisher = "Inserisci l'editore";
    } else if (book.publisher.length > 150) {
      errors.publisher = "Lunghezza massima 150 caratteri";
    }
    if (!book.pages_num) {
      errors.pages_num = "Inserisci il numero di pagine";
    } else if (book.pages_num.toString().length > 5) {
      errors.pages_num = "Lunghezza massima 5 cifre";
    } else if (book.pages_num < 20) {
      errors.pages_num = "Minimo 20 pagine";
    }
    if (!book.ISBN_13) {
      errors.ISBN_13 = "Inserisci il codice ISBN";
    } else if (book.ISBN_13.toString().length !== 13) {
      errors.ISBN_13 = "Il codice deve essere composto da 13 cifre";
    } else if (book.ISBN_13.toString().substring(0,3) !== "978") {
      errors.ISBN_13 = "Il codice deve iniziare per 978";
    }
    if (book.ISBN_10 && (book.ISBN_10.toString().length !== 10)) {
      errors.ISBN_10 = "Il codice deve essere composto da 10 cifre";
    }
    if (Date(book.publication) > new Date()) { // DOESN'T WORK
      errors.publication = "Data di pubblicazione non valida";
    }
    if (book.edition_num && book.edition_num < 1) {
      errors.edition_num = "Numero di edizione non valido";
    } else if (book.edition_num && book.edition_num.toString().length > 2) {
      errors.edition_num = "Max 2 cifre";
    }
    if (book.languages && (book.languages.length > 4)) {
      errors.languages = "Massimo 4 lingue";
    }
    if (book.genres && (book.genres.length > 3)) {
      errors.genres = "Massimo 3 generi";
    }
    if (book.collections && (book.collections.length > 5)) {
      errors.collections = "Massimo 5 collezioni";
    }
    if (book.collections && book.collections.length > 255) {
      errors.collections = "Lunghezza massima 255 caratteri";
    }
    if (book.description && book.description.length < 150) {
      errors.description = `Lunghezza minima 150 caratteri`;
    }
    if (book.description && book.description.length > this.state.description_maxChars) {
      errors.description = `Lunghezza massima ${this.state.description_maxChars} caratteri`;
    }
    if (book.incipit && book.incipit.length < 255) {
      errors.incipit = `Lunghezza minima 255 caratteri`;
    }
    if (book.incipit && book.incipit.length > this.state.incipit_maxChars) {
      errors.incipit = `Lunghezza massima ${this.state.incipit_maxChars} caratteri`;
    }
    return errors;
  }

  exitEditing = () => this.props.isEditing();
	
	render() {
    const { book, description_leftChars, description_maxChars, incipit_leftChars, incipit_maxChars, isEditingDescription, isEditingIncipit, errors } = this.state;
		const menuItemsMap = (arr, values) => arr.map(item => 
			<MenuItem 
				value={item.name} 
				key={item.id} 
				insetChildren={values ? true : false} 
				checked={values ? values.includes(item.name) : false} 
				primaryText={item.name} 
			/>
		);

		return (
      <div ref="BookFormComponent">
        <div className="content-background"><div className="bg" style={{backgroundImage: `url(${book.covers[0]})`}}></div></div>
        <div className="container top">
          <form onSubmit={this.onSubmit} className="card">
            {this.state.loading && <div className="loader"><CircularProgress /></div>}
            <div className="container-md">
              <div className="edit-book-cover">
                <Cover book={book} />
              </div>
              <div className="edit-book-info">
                <div className="form-group">
                  <TextField
                    name="title"
                    type="text"
                    hintText="es: Sherlock Holmes"
                    errorText={errors.title}
                    floatingLabelText="Titolo"
                    value={book.title || ''}
                    onChange={this.onChange}
                    fullWidth={true}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    name="subtitle"
                    type="text"
                    hintText="es: Uno studio in rosso"
                    errorText={errors.subtitle}
                    floatingLabelText="Sottotitolo"
                    value={book.subtitle || ''}
                    onChange={this.onChange}
                    fullWidth={true}
                  />
                </div>
                <div className="form-group">
                  <ChipInput
                    name="authors"
                    hintText="es: Arthur Conan Doyle"
                    errorText={errors.authors}
                    floatingLabelText="Autore"
                    value={book.authors}
                    onRequestAdd={chip => this.onAddChip("authors", chip)}
                    onRequestDelete={chip => this.onDeleteChip("authors", chip)}
                    fullWidth={true}
                  />
                </div>
                <div className="row">
                  <div className="form-group col-sm-6">
                    <TextField
                      name="ISBN_13"
                      type="number"
                      hintText="es: 9788854152601"
                      errorText={errors.ISBN_13}
                      floatingLabelText="ISBN-13"
                      value={book.ISBN_13}
                      onChange={this.onChangeNumber}
                      fullWidth={true}
                    />
                  </div>
                  <div className="form-group col-sm-6">
                    <TextField
                      name="ISBN_10"
                      type="number"
                      hintText="es: 8854152609"
                      errorText={errors.ISBN_10}
                      floatingLabelText="ISBN-10"
                      value={book.ISBN_10}
                      onChange={this.onChangeNumber}
                      fullWidth={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-8">
                    <TextField
                      name="publisher"
                      type="text"
                      hintText="es: Newton Compton (Live)"
                      errorText={errors.publisher}
                      floatingLabelText="Editore"
                      value={book.publisher}
                      onChange={this.onChange}
                      fullWidth={true}
                    />
                  </div>
                  <div className="form-group col-4">
                    <TextField
                      name="pages_num"
                      type="number"
                      hintText="es: 128"
                      errorText={errors.pages_num}
                      floatingLabelText="Pagine"
                      value={book.pages_num}
                      onChange={this.onChangeNumber}
                      fullWidth={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-8">
                    <DatePicker 
                      name="publication"
                      hintText="2013-05-01" 
                      cancelLabel="Annulla"
                      openToYearSelection={true} 
                      errorText={errors.publication}
                      floatingLabelText="Data di pubblicazione"
                      value={book.publication ? new Date(book.publication) : ''}
                      onChange={this.onChangeDate("publication")}
                      fullWidth={true}
                    />
                  </div>
                  <div className="form-group col-4">
                    <TextField
                      name="edition_num"
                      type="number"
                      hintText="es: 1"
                      errorText={errors.edition_num}
                      floatingLabelText="Edizione"
                      value={book.edition_num}
                      onChange={this.onChangeNumber}
                      fullWidth={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-6">
                    <SelectField
                      errorText={errors.languages}
                      floatingLabelText="Lingua"
                      value={book.languages}
                      onChange={this.onChangeSelect("languages")}
                      fullWidth={true}
                      multiple={true}
                      maxHeight={300}
                    >
                      {menuItemsMap(languages, book.languages)}
                    </SelectField>
                  </div>
                  <div className="form-group col-6">
                    <SelectField
                      errorText={errors.format}
                      floatingLabelText="Formato"
                      value={book.format}
                      onChange={this.onChangeSelect("format")}
                      fullWidth={true}
                      maxHeight={200}
                    >
                      {menuItemsMap(formats, book.format)}
                    </SelectField>
                  </div>
                </div>
                <div className="form-group">
                  <SelectField
                    errorText={errors.genres}
                    floatingLabelText="Genere (max 3)"
                    value={book.genres}
                    onChange={this.onChangeSelect("genres")}
                    fullWidth={true}
                    multiple={true}
                    maxHeight={200}
                  >
                    {menuItemsMap(genres, book.genres)}
                  </SelectField>
                </div>
                <div className="form-group">
                  <ChipInput
                    name="collections"
                    hintText="es: Sherlock Holmes"
                    errorText={errors.collections}
                    floatingLabelText="Collezione (max 5)"
                    value={book.collections}
                    onRequestAdd={chip => this.onAddChip("collections", chip)}
                    onRequestDelete={chip => this.onDeleteChip("collections", chip)}
                    fullWidth={true}
                  />
                </div>
                {isEditingDescription /* || book.description */ ?
                  <div className="form-group">
                    <TextField
                      name="description"
                      type="text"
                      hintText={`Inserisci una descrizione del libro (max ${description_maxChars} caratteri)...`}
                      errorText={errors.description}
                      floatingLabelText="Descrizione"
                      value={book.description}
                      onChange={this.onChangeMaxChars}
                      fullWidth={true}
                      multiLine={true}
                      rows={4}
                    />
                    {(description_leftChars !== undefined) && 
                      <p className={`message ${(description_leftChars < 0) && 'alert'}`}>Caratteri rimanenti: {description_leftChars}</p>
                    }
                  </div>
                :
                  <div className="info-row">
                    <button className="btn flat centered" onClick={this.onEditDescription}>
                      {book.description ? 'Modifica la descrizione' : 'Aggiungi una descrizione'}
                    </button>
                  </div>
                }
                {isEditingIncipit /* || book.incipit */ ? 
                  <div className="form-group">
                    <TextField
                      name="incipit"
                      type="text"
                      hintText={`Inserisci i primi paragrafi del libro (max ${incipit_maxChars} caratteri)...`}
                      errorText={errors.incipit}
                      floatingLabelText="Incipit"
                      value={book.incipit || ''}
                      onChange={this.onChangeMaxChars}
                      fullWidth={true}
                      multiLine={true}
                      rows={4}
                    />
                    {(incipit_leftChars !== undefined) && 
                      <p className={`message ${(incipit_leftChars < 0) && 'alert'}`}>Caratteri rimanenti: {incipit_leftChars}</p>
                    }
                  </div>
                :
                  <div className="info-row">
                    <button className="btn flat centered" onClick={this.onEditIncipit}>
                      {book.incipit ? "Modifica l'incipit" : "Aggiungi un incipit"}
                    </button>
                  </div>
                }

              </div>
            </div>
            <div className="footer no-gutter">
              <button className="btn btn-footer primary">Salva le modifiche</button>
            </div>
          </form>
          <div className="form-group">
            <button onClick={this.exitEditing} className="btn flat centered">Annulla</button>
          </div>
        </div>
      </div>
		);
	}
}

BookForm.propTypes = {
  isEditing: funcType.isRequired,
  book: bookType.isRequired
}